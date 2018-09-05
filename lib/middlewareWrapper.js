const {
  type,
} = require('ramda');
const { UNKNOWN_ERROR } = require('../symbols');

const pass = nextFn => () => nextFn();
const error = nextFn => err => nextFn(err || UNKNOWN_ERROR);
const setToReq = req => (key, value) => Object.assign(req, { [key]: value });

const isPromise = obj => (
  obj
  && obj.then
  && obj.catch
  && type(obj.then) === 'Function'
  && type(obj.catch) === 'Function');

module.exports = (props, middlewareFn) =>
  (req, res, next) => {
    const result = middlewareFn({
      req,
      res,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      next,
      error: error(next),
      pass: pass(next),
      setToReq: setToReq(req),
      props,
    });

    if (isPromise(result)) {
      result.catch(next);
    }
  };
