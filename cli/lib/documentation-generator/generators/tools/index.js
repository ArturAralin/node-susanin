const {
  curryN,
  prop,
  __,
  pipe,
  cond,
  equals,
  join,
  T,
  when,
  isNil,
  complement,
} = require('ramda');

const findRule = curryN(2, (searchName, rules) =>
  rules.find(({ name }) => searchName === name));

const valueHandler = when(
  complement(isNil),
  pipe(
    prop('value'),
    cond([
      [
        pipe(
          prop('isJoi'),
          equals(true),
        ),
        pipe(
          prop('path'),
          join('.'),
          value => ({ type: 'reference', value }),
        ),
      ],
      [T, value => ({ type: 'value', value })],
    ]),
  ),
);
const getMin = pipe(findRule('min', __), valueHandler);
const getMax = pipe(findRule('max', __), valueHandler);

// eslint-disable-next-line no-console
const printText = text => console.log(text);

module.exports = {
  findRule,
  getMin,
  getMax,
  printText,
};
