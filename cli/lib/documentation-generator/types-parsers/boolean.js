const {
  map,
  toPairs,
  pipe,
} = require('ramda');

const parseInner = map((v) => {
  const values = v.values();

  if (values.length > 0) {
    return values;
  }

  return null;
});

const convertToRules = pipe(
  toPairs,
  map(([name, value]) => ({ name, value })),
);

module.exports = (validation) => {
  const type = validation._type;
  const rules = convertToRules(parseInner(validation._inner));

  return {
    type,
    rules,
  };
};
