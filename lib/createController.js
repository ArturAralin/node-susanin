const { fromPairs } = require('ramda');
const { UNKNOWN_ERROR } = require('../symbols');

const error = nextFn => err => nextFn(err || UNKNOWN_ERROR);
const reply = (responseBuilder, res, data) => {
  res
    .status(200)
    .json(responseBuilder(data));
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
      reply: reply.bind(null, responseBuilder, res),
      headers,
      query,
      body,
      params,
    };

    const extraParams = fromPairs(extraControllerProps
      .map(key => ([key, req[key]])));

    return controllerFn(Object.assign(controllerParams, extraParams));
  };
