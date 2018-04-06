const {
  flatten,
  pipe,
  filter,
  map,
  when,
  compose,
  isNil,
  not,
  join,
  defaultTo,
  concat,
  anyPass,
  isEmpty,
  head,
  prop,
  ifElse,
  always,
  mergeAll,
  invoker,
} = require('ramda');
const rl = require('readline-sync');
const fs = require('fs');
const {
  resolve: pathResolve,
} = require('path');
const types = require('./types');
const {
  printText,
} = require('../tools');

const APIDOC_CONFIG_NAME = 'apidoc.json';
const DOCUMENTATION_NAME = 'apidoc-documentation.txt';

const clearAndFlattenArrays = pipe(filter(Boolean), flatten);
const isNotNil = compose(not, isNil);
const composePoints = when(
  anyPass([isNotNil, isEmpty]),
  pipe(
    filter(isNotNil),
    map(point => ` * - ${point}`),
    concat(['']),
    join('\n'),
  ),
);
const composeDisallowedVaues = when(
  isNotNil,
  pipe(
    join(', '),
    v => [v],
    concat(['Disallowed Values: ']),
    join(' '),
  ),
);

const getArrayType = pipe(
  prop('itemsRules'),
  head,
  ifElse(
    isNil,
    always('array'),
    pipe(
      prop('type'),
      v => `${v}[]`,
    ),
  ),
);

const descriptionMsg = defaultTo('No description');
const block = parts => `
/**
${
  parts
    .map(line => ` * ${line}`)
    .join('\n')
}
 */
`;
const multipleDescription = (description, points) =>
  `${descriptionMsg(description)}${composePoints(points)}`;

const api = (method, path, name) => `@api {${method.toUpperCase()}} ${path} ${name || path}`;
const apiVersion = v => `@apiVersion ${v || '0.0.0'}`;
const apiName = (name, path) => `@apiName ${name || path}`;
const apiGroup = name => `@apiGroup ${name || 'NO GROUP'}`;
const apiDescription = text => `@apiDescription ${descriptionMsg(text)}`;

const primitiveParam = (group, name, {
  description,
  defaultValue,
  allowedValues,
  disallowedValues,
  rules,
  type,
  required,
}) => {
  const defaultValuePart = defaultValue ? `=${defaultValue}` : '';
  const namePart = [
    !required && '[',
    `${name}${defaultValuePart}`,
    !required && ']',
  ].filter(Boolean).join('');
  const typePart = types({
    type,
    allowedValues,
    rules,
  });

  return `@apiParam (${group}) ${typePart} ${namePart} ${multipleDescription(description, [
    composeDisallowedVaues(disallowedValues),
  ])}`;
};

let objectParams;
let arrayParams;

const apiParam = (group, name, { type, validation }) => {
  switch (type) {
    case 'object':
      return objectParams(group, name, validation);
    case 'array':
      return arrayParams(group, name, validation);
    default:
      return primitiveParam(group, name, validation);
  }
};

arrayParams = (group, parentName, validation) => {
  const {
    itemsRules,
    skipValidation,
  } = validation;

  const newValidation = mergeAll([
    validation,
    {
      type: getArrayType(validation),
    },
  ]);

  return clearAndFlattenArrays([
    !skipValidation && primitiveParam(group, parentName, newValidation),
    itemsRules
      .map((itemValidation) => {
        const { type } = itemValidation;

        if (type === 'object') {
          return apiParam(group, parentName, {
            type,
            validation: itemValidation,
          });
        }

        return null;
      }),
  ]);
};

objectParams = (group, parentName, validation) => {
  const {
    keysRules,
    skipValidation,
  } = validation;

  return clearAndFlattenArrays([
    !skipValidation && primitiveParam(group, parentName, validation),
    keysRules
      .map(([name, keyValidation]) => {
        const {
          type: keyType,
        } = keyValidation;
        const keyName = skipValidation ? name : `${parentName}.${name}`;

        return apiParam(group, keyName, {
          type: keyType,
          validation: keyValidation,
        });
      }),
  ]);
};

const defineBlock = `/**
* @apiDefine getParams Query params
*/

/**
* @apiDefine bodyParams Body params
*/

/**
* @apiDefine uriParams URI params
*/
`;

const buildJsonConfiguration = (name, description, version) =>
  JSON.stringify({
    name,
    version,
    description,
  }, null, '  ');

const readConfigFile = pipe(
  fs.readFileSync,
  invoker(0, 'toString'),
  JSON.parse,
);

module.exports = (absoluteOutputPath, ast) => {
  const absoluteConfigPath = pathResolve(absoluteOutputPath, APIDOC_CONFIG_NAME);
  const isConfigExists = fs.existsSync(absoluteConfigPath);

  printText('ApiDoc docs generator');

  const {
    name: currentProjectName,
    description: currentProjectDescription,
    version: currentProjectVersion,
  } = (isConfigExists && readConfigFile(absoluteConfigPath)) || {};
  const projectName = !isConfigExists
    ? rl.question('Project name (default: ""): ') || ''
    : currentProjectName;
  const projectDescription = !isConfigExists
    ? rl.question('Project description (default: ""): ') || ''
    : currentProjectDescription;


  const projectVersion = rl.question(`Project version (${isConfigExists ? `current: ${currentProjectVersion}` : 'default: 1.0.0'}): `) || currentProjectVersion || '1.0.0';
  const configurationData = buildJsonConfiguration(projectName, projectDescription, projectVersion);

  const routes = ast
    .map(({
      name,
      description,
      version,
      group,
      method,
      path,
      validation: {
        query,
        params,
        body,
      },
    }) => {
      const parts = flatten([
        api(method, path, name),
        apiName(name, path),
        apiVersion(version),
        apiDescription(description),
        apiGroup(group),
        params && apiParam('uriParams', 'params', params),
        query && apiParam('getParams', 'query', query),
        body && apiParam('bodyParams', 'body', body),
      ].filter(Boolean));

      return block(parts);
    })
    .join('');

  const docsText = [
    defineBlock,
    routes,
  ].join('');


  fs.writeFileSync(absoluteConfigPath, configurationData);
  fs.writeFileSync(pathResolve(absoluteOutputPath, DOCUMENTATION_NAME), docsText);
};
