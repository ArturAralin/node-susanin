const {
  fromPairs,
  is,
} = require('ramda');
const {
  errorP,
} = require('./functions');
const { UNKNOWN_ERROR } = require('../symbols');

const isPromise = is(Promise);

const error = nextFn => err => nextFn(err || UNKNOWN_ERROR);
const reply = (responseBuilder, next, res, data) => {
  if (isPromise(data)) {
    data
      .then(responseBuilder.bind(null, res))
      .catch(err => next(JSON.stringify(err)));
  } else {
    responseBuilder(res, data);
  }
};

module.exports = (responseBuilder, extraControllerProps, controllerFn) =>
  (req, res, next) => {
    const {
      headers,
      query,
      body,
      params,
      propsStorage,
    } = req;

    const controllerParams = {
      req,
      res,
      next,
      error: error(next),
      reply: reply.bind(null, responseBuilder, next, res),
      headers,
      query,
      body,
      params,
      errorP,
      props: propsStorage,
    };

    const extraParams = fromPairs(extraControllerProps
      .map(key => ([key, req[key]])));

    return controllerFn(Object.assign(controllerParams, extraParams));
  };
