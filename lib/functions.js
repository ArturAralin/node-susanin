const {
  curry,
  partialRight,
} = require('ramda');

const errorP = partialRight(curry((errorData, promise) => {
  const fn = () => { throw errorData; };

  if (promise && promise.toString() === '[object Promise]') {
    return promise.catch(fn);
  }

  return fn;
}), [null]);

module.exports = {
  errorP,
};

