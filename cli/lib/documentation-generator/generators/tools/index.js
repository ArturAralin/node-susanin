const {
  curryN,
  prop,
  __,
  pipe,
} = require('ramda');

const findRule = curryN(2, (searchName, rules) =>
  rules.find(({ name }) => searchName === name));

const getMin = pipe(findRule('min', __), prop('value'));
const getMax = pipe(findRule('max', __), prop('value'));

// eslint-disable-next-line no-console
const printText = text => console.log(text);

module.exports = {
  findRule,
  getMin,
  getMax,
  printText,
};
