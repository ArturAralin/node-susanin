const {
  getMin,
  getMax,
} = require('../tools');
const {
  prop,
  cond,
  propEq,
  pipe,
  when,
  complement,
  isNil,
} = require('ramda');

const allowedValuePart = (type, allowedValues) => {
  if (!allowedValues) {
    return '';
  }

  const items = allowedValues
    .map(value =>
      (type === 'string'
        ? `"${value}"`
        : value))
    .join(',');

  return `=${items}`;
};

const typeEquals = propEq('type');
const getVal = prop('value');
const handleValue = when(
  complement(isNil),
  cond([
    [
      typeEquals('value'),
      getVal,
    ],
    [
      typeEquals('reference'),
      pipe(getVal, v => `field "${v}"`),
    ],
  ]),
);

const sizes = (type, rules) => {
  const min = getMin(rules);
  const max = getMax(rules);
  const rulesIsNotExists = !min && !max;

  if (rulesIsNotExists) {
    return '';
  }

  return [
    '{',
    min && `GTE ${handleValue(min)}; `,
    max && `LTE ${handleValue(max)}`,
    '}',
  ].join('');
};

module.exports = ({
  type,
  allowedValues,
  rules,
}) => `{${type}${sizes(type, rules)}${allowedValuePart(type, allowedValues)}}`;

