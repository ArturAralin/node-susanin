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
  const handler = dataObj =>
    res
      .status(200)
      .json(responseBuilder(dataObj));

  if (isPromise(data)) {
    data
      .then(handler)
      .catch(err => next(JSON.stringify(err)));
  } else {
    handler(data);
  }
};

module.exports = (responseBuilder, extraControllerProps, controllerFn) =>
  (req, res, next) => {
    const {
      headers,
      query,
      body,
      params,
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
    };

    const extraParams = fromPairs(extraControllerProps
      .map(key => ([key, req[key]])));

    return controllerFn(Object.assign(controllerParams, extraParams));
  };
