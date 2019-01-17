const glob = require('glob');
const { concat } = require('ramda');

module.exports = (patterns, pathsRelateTo) => {
  const options = {
    realpath: true,
    cwd: pathsRelateTo,
  };

  return patterns
    .map(pattern => glob.sync(pattern, options))
    .reduce(concat, [])
    .map(require)
    .reduce(concat, []);
};
