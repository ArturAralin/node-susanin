const {
  flatten,
} = require('ramda');
const types = require('./types');

const block = parts => `
/**
${
  parts
    .map(line => ` * ${line}`)
    .join('\n')
}
 */
`;
const api = (method, path, name) => `@api {${method.toUpperCase()}} ${path} ${name || path}`;
const apiVersion = v => `@apiVersion ${v || '0.0.0'}`;
const apiName = (name, path) => `@apiName ${name || path}`;
const apiGroup = name => `@apiGroup ${name || 'NO GROUP'}`;
const apiDescription = text => `@apiDescription ${text || 'No description'}`;
const primitiveParam = (group, name, {
  description,
  defaultValue,
  allowedValues,
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

  return `@apiParam (${group}) ${typePart} ${namePart} ${description || 'No description'}`;
};

let objectParams;

const apiParam = (group, name, { type, validation }) => {
  switch (type) {
    case 'object':
      return objectParams(group, name, validation);
    default:
      return primitiveParam(group, name, validation);
  }
};

objectParams = (group, parentName, validation) => {
  const {
    keysRules,
    skipValidation,
  } = validation;

  return flatten([
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
  ].filter(Boolean));
};
//  `@apiParam (${group}) {String} field`;

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

module.exports = (ast) => {
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

  return [
    defineBlock,
    routes,
  ].join('');
};

