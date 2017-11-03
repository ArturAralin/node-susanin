const { UNKNOWN_ERROR } = require('../symbols');

const pass = nextFn => () => nextFn();
const error = nextFn => err => nextFn(err || UNKNOWN_ERROR);
const setToReq = req => (key, value) => Object.assign(req, { [key]: value });

module.exports = (props, middlewareFn) =>
  (req, res, next) =>
    middlewareFn({
      req,
      res,
      headers: req.headers,
      next,
      error: error(next),
      pass: pass(next),
      setToReq: setToReq(req),
      props,
    });
