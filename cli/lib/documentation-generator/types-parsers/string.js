const parseAlphanum = () => ({
  name: 'alphanum',
  value: 'A-Za-z0-9',
});

const parseBase64 = test => ({
  name: 'base64',
  value: test.arg,
});

const parseCreditCard = () => ({
  name: 'creditCard',
  value: 'Lunh Algorithm',
});

const parseEmail = () => ({
  name: 'email',
});

const parseGUID = () => ({
  name: 'guid',
});

const testsParser = (test) => {
  switch (test.name) {
    case 'alphanum':
      return parseAlphanum();
    case 'base64':
      return parseBase64(test);
    case 'creditCard':
      return parseCreditCard();
    case 'email':
      return parseEmail();
    case 'guid':
      return parseGUID();
    default:
      return null;
  }
};

module.exports = (validation) => {
  console.log(validation);
  const type = validation._type;
  const rules = validation._tests.map(testsParser);

  return {
    type,
    rules,
  };
};
