const createRouter = require('./lib/createRouter');
const {
  errorP,
} = require('./lib/functions');
const { symbols: methods } = require('./methods');

module.exports = {
  createRouter,
  methods,
  errorP,
};
