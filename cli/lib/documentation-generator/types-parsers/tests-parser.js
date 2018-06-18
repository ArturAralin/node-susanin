const { isEmpty, isNil } = require('ramda');

const testsParser = (test) => {
  const isArgEmpty = isEmpty(test.arg) || isNil(test.arg);

  return {
    name: test.name,
    value: isArgEmpty ? null : test.arg,
  };
};

module.exports = {
  testsParser,
};
