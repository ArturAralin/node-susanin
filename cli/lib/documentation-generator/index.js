const {
  concat,
} = require('ramda');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const getModel = require('./routes-ast');
const docsGenerators = require('./generators');

const CWD = process.cwd();
const DEFAULT_OUTPUT_FOLDER = path.resolve(CWD, './documentation');
const DEFAULT_ROUTER_FILE_MASK = './**/*.router.js';
const DEFAULT_DOCS_NAME = 'docs.txt';

module.exports = (cli) => {
  cli
    .command('build-docs <routes-directory> <docs-format>')
    .option('--routerFileMask <routerFileMask>', 'Router files mask', DEFAULT_ROUTER_FILE_MASK)
    .option('-O, --outputPath <outputPath>', 'xxx', DEFAULT_OUTPUT_FOLDER)
    .option('--fileName <fileName>', 'doc file name', DEFAULT_DOCS_NAME)
    .action((routesDirectory, docsFormat, { outputPath, routerFileMask, fileName }) => {
      const absoluteRoutesDirectory = path.resolve(CWD, routesDirectory);
      const absoluteOutputPath = path.resolve(CWD, outputPath, fileName);
      const options = {
        realpath: true,
        cwd: absoluteRoutesDirectory,
      };

      const ast = glob
        .sync(routerFileMask, options)
        .map(require)
        .map(getModel)
        .reduce(concat);

      const text = docsGenerators[docsFormat](ast);

      fs.writeFileSync(absoluteOutputPath, text);
    });
};

