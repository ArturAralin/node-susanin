const { testsParser } = require('./tests-parser');
const common = require('./common');
const {
  merge,
} = require('ramda');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const commonRules = common(validation);

  return merge(commonRules, {
    type,
    rules,
  });
};
