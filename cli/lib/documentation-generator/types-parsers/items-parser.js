const array = require('./array.js');
const number = require('./number.js');
const object = require('./array.js');
const string = require('./string.js');

const parsers = {
  array,
  number,
  object,
  string,
};

const itemsParser = item => parsers[item._type](item);

module.exports = {
  itemsParser,
};
