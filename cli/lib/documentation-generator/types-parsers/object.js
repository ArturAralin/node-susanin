const { testsParser } = require('./tests-parser');
const { itemsParser } = require('./items-parser');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const keysRules = validation._inner.children
    .map(({ key, schema }) => [
      key,
      itemsParser(schema),
    ]);

  return {
    type,
    rules,
    keysRules,
  };
};
