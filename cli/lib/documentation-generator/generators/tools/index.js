const {
  curryN,
  prop,
  __,
  pipe,
  is,
} = require('ramda');

const findRule = curryN(2, (searchName, rules) =>
  rules.find(({ name }) => searchName === name));

const getMin = pipe(findRule('min', __), prop('value'));
const getMax = pipe(findRule('max', __), prop('value'));

// eslint-disable-next-line no-console
const printText = text => console.log(text);

const isNumber = is(Number);

module.exports = {
  findRule,
  getMin,
  getMax,
  printText,
  isNumber,
};
