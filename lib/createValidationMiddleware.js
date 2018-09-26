const joi = require('joi');

const getValidationSchema = (defaultValidation, schema) => {
  /* eslint-disable-next-line no-underscore-dangle */
  if (schema._type) {
    return schema;
  }

  const fullSchema = Object.assign({}, defaultValidation, schema);

  return joi.object.keys(fullSchema);
};

module.exports = (routerDefaultValidation, propName, errorBuilder, schema = {}) => {
  const defaultValidation = routerDefaultValidation[propName];
  const validationSchema = getValidationSchema(defaultValidation, schema);

  return (req, res, next) => {
    const { value, error } = joi.validate(req[propName], validationSchema);

    if (error) {
      next(errorBuilder(error));

      return;
    }

    req[propName] = value;

    next();
  };
};
