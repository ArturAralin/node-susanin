const { map } = require('ramda');

const parseInner = map((v) => {
  const values = v.values();

  if (values.length > 0) {
    return values;
  }

  return null;
});

module.exports = (validation) => {
  const type = validation._type;
  const rules = parseInner(validation._inner);

  return {
    type,
    rules,
  };
};
