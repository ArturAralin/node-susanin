const parseMin = test => ({
  rule: 'min',
  value: test.arg,
});

const parseMax = test => ({
  rule: 'max',
  value: test.arg,
});


const testsParser = (test) => {
  switch (test.name) {
    case 'min':
      return parseMin(test);
    case 'max':
      return parseMax(test);
    default:
      return null;
  }
};

module.exports = (validation) => {
  const type = validation._type;
  const rules = validation._tests.map(testsParser);

  return {
    type,
    rules,
  };
};
