const joi = require('joi');

module.exports = (routerDefaultValidation, propName, errorBuilder, schema = {}) => {
  const defaultValidation = routerDefaultValidation[propName];
  const fullSchema = Object.assign({}, defaultValidation, schema);
  /* eslint-disable no-underscore-dangle */
  const validationSchema = schema._type ? fullSchema : joi.object().keys(fullSchema);
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
