module.exports = (validation) => {
  const description = validation._description || null;
  const defaultValue = validation._flags.default || null;
  const allowedValuesList = validation._valids.values();
  const allowedValues = allowedValuesList.length > 0 ? allowedValuesList : null;

  const disallowedValuesList = validation._invalids.values();
  const disallowedValues = disallowedValuesList.length > 0 ? disallowedValuesList : null;

  return {
    description,
    defaultValue,
    allowedValues,
    disallowedValues,
  };
};
