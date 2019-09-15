const {
  curry,
  partialRight,
} = require('ramda');

/**
 * This function wraps error data into promise
 * @private
 * @function
 * @name errorP
 * @param errorData - error payload
 * @param promise
 */
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

