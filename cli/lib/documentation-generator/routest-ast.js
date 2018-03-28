const {
  GET,
  POST,
  PUT,
  DELETE,
  HEAD,
  OPTIONS,
  TRACE,
  PATCH,
} = require('../../../methods');
const parseCommon = require('./types-parsers/common');
const parseNumber = require('./types-parsers/number');
const parseString = require('./types-parsers/string');

const METHODS_NAMES = {
  [GET]: 'get',
  [POST]: 'post',
  [PUT]: 'put',
  [DELETE]: 'delete',
  [HEAD]: 'head',
  [OPTIONS]: 'options',
  [TRACE]: 'trace',
  [PATCH]: 'patch',
};

const parseValidationItem = (validation) => {
  switch (validation._type) {
    case 'number':
      return parseNumber(validation);
    case 'string':
      return parseString(validation);
    default:
      return null;
  }
};

const parseValidation = validationObject =>
  Object
    .keys(validationObject || {})
    .map((name) => {
      const commonValidation = parseCommon(validationObject[name]);
      const typedValidation = parseValidationItem(validationObject[name]);

      return [name, { ...commonValidation, ...typedValidation }];
    });

const parseRoute = ({
  method,
  path,
  validation: {
    body,
    params,
    query,
  },
}) => ({
  method: METHODS_NAMES[method],
  path,
  validation: {
    query: parseValidation(query),
    body: parseValidation(body),
    params: parseValidation(params),
  },
});

module.exports = (router) => {
  const x = router.map(parseRoute);

  console.log(x[0].validation.query[1][1].rules);
};
