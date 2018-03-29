const { testsParser } = require('./tests-parser');
const { itemsParser } = require('./items-parser');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const itemsRules = validation._inner.items.map(itemsParser);

  return {
    type,
    rules,
    itemsRules,
  };
};
