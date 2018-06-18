const joi = require('joi');
const parsers = require('./types-parsers');
const {
  pipe,
  slice,
  dropLast,
  invoker,
  merge,
  mergeAll,
} = require('ramda');

const { common: commonParser } = parsers;

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

const getMethodName = pipe(
  invoker(0, 'toString'),
  slice(7, Infinity),
  dropLast(1),
);

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
      method: getMethodName(method),
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
