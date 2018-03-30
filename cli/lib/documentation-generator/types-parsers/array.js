const { testsParser } = require('./tests-parser');
const commonParser = require('./common');

const arrayParser = (parsers, validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const itemsRules = validation._inner.items
    .map(item => ({
      ...commonParser(item),
      ...parsers[item._type](item),
    }));

  return {
    type,
    rules,
    itemsRules,
  };
};

module.exports = arrayParser;
