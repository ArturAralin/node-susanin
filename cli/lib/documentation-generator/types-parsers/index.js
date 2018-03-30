const array = require('./array');
const boolean = require('./boolean');
const common = require('./common');
const date = require('./date');
const number = require('./number');
const object = require('./object');
const string = require('./string');

const parsers = {};

module.exports = Object.assign(parsers, {
  array: array.bind(null, parsers),
  boolean,
  common,
  date,
  number,
  object: object.bind(null, parsers),
  string,
});
