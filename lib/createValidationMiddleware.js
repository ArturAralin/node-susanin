const joi = require('joi');

module.exports = (propName, errorBuilder, schema = {}) => {
  /* eslint-disable no-underscore-dangle */
  const validationSchema = schema._type ? schema : joi.object().keys(schema);
  /* eslint-enable no-underscore-dangle */

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
