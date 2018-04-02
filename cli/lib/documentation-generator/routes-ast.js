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
const {
  merge,
  mergeAll,
} = require('ramda');

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

const DEFAULT_INFO = {
  name: null,
  description: null,
  version: null,
  group: null,
};

const parseValidation = (validationObject) => {
  const {
    isJoi,
    _type,
  } = validationObject;
  const type = isJoi ? _type : 'object';
  const obj = isJoi ? validationObject : joi.object().keys(validationObject);
  const typedValidation = parsers[type](obj);
  const commonValidation = commonParser(obj, !isJoi);

  return {
    type,
    validation: merge(commonValidation, typedValidation),
  };
};

const parseRoute = ({
  method,
  path,
  validation = {},
  info = {},
}) => {
  const {
    query,
    body,
    params,
  } = validation;

  return mergeAll([
    DEFAULT_INFO,
    info,
    {
      method: METHODS_NAMES[method],
      path,
      validation: {
        query: (query && parseValidation(query)) || null,
        body: (body && parseValidation(body)) || null,
        params: (params && parseValidation(params)) || null,
      },
    },
  ]);
};

module.exports = router =>
  router.map(parseRoute);
