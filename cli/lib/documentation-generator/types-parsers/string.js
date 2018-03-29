const { testsParser } = require('./tests-parser');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);

  return {
    type,
    rules,
  };
};
