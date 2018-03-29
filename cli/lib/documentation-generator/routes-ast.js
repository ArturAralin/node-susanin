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
const joi = require('joi');
const parsers = require('./types-parsers');

const { common: commonParser } = parsers;

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

const parseValidation = (validationObject) => {
  const {
    isJoi,
    _type,
  } = validationObject;
  const type = isJoi ? _type : 'object';
  const obj = isJoi ? validationObject : joi.object().keys(validationObject);
  const typedValidation = parsers[type](obj);
  const commonValidation = commonParser(obj);

  return {
    type,
    validation: {
      ...commonValidation,
      ...typedValidation,
    },
  };
};

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
    query: query && parseValidation(query),
    body: body && parseValidation(body),
    params: params && parseValidation(params),
  },
});

module.exports = (router) => {
  const x = router.map(parseRoute);

  console.log(x[0].validation.body.validation.itemsRules);
};
