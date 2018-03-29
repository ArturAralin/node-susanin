const path = require('path');
const glob = require('glob');
const getModel = require('./routes-ast');

const MASK = './*.router.js';
const RELATE_TO = path.resolve(__dirname, '../../../examples/simple');

const options = {
  realpath: true,
  cwd: RELATE_TO,
};

glob
  .sync(MASK, options)
  .map(require)
  .map(getModel);

