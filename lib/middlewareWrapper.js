const {
  type,
} = require('ramda');
const { UNKNOWN_ERROR } = require('../symbols');

const pass = nextFn => () => nextFn();
const error = nextFn => err => nextFn(err || UNKNOWN_ERROR);
// setToReq now deprecated
const setToReq = req => (key, value) => Object.assign(req, { [key]: value });
const setToProps = props => (key, value) => {
  if (props[key] !== undefined) {
    throw Error(`Property "${key}" already defined`);
  }

  Object.assign(props, { [key]: value });
};

const isPromise = obj => (
  obj
  && obj.then
  && obj.catch
  && type(obj.then) === 'Function'
  && type(obj.catch) === 'Function');

module.exports = (middlewaresProps, middlewareFn) =>
  (req, res, next) => {
    req.propsStorage = Object.assign({}, middlewaresProps);

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
      setToProps: setToProps(req.propsStorage),
      props: req.propsStorage,
    });

    if (isPromise(result)) {
      result.catch(next);
    }
  };
