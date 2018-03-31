const { testsParser } = require('./tests-parser');
const commonParser = require('./common');
const {
  merge,
} = require('ramda');

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);
  const commonRules = commonParser(validation);

  return merge(commonRules, {
    type,
    rules,
  });
};
