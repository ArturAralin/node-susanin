const { testsParser } = require('./tests-parser');
const commonParser = require('./common');
const {
  merge,
  type: ramdaType,
  pipe,
  equals,
} = require('ramda');

const isArray = pipe(ramdaType, equals('Array'));

const arrayParser = (parsers, validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const itemsRules = validation._inner.items
    .map(item => merge(
      commonParser(item),
      parsers[item._type](item),
    ));
  const arrayDefaultValue = (validation._flags && validation._flags.default) || undefined;
  const defaultValue = isArray(arrayDefaultValue) ? '[]' : arrayDefaultValue;

  return {
    type,
    rules,
    itemsRules,
    defaultValue,
  };
};

module.exports = arrayParser;
