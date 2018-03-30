const { testsParser } = require('./tests-parser');
const common = require('./common');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const commonRules = common(common);

  return {
    ...commonRules,
    type,
    rules,
  };
};
