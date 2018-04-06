const {
  concat,
} = require('ramda');
const path = require('path');
const glob = require('glob');
const getModel = require('./routes-ast');
const docsGenerators = require('./generators');
const {
  printText,
} = require('./generators/tools');

const CWD = process.cwd();
const DEFAULT_OUTPUT_FOLDER = path.resolve(CWD, './documentation');

const descriptionText = `Params specification:

    <routes-mask> - Mask for routes files searching (example: path/to/**/*.router.js)
    <docs-format> - Output documentation format

  Supported docs format:
    apidoc - Simple inline docs for RESTful api
`;

module.exports = (cli) => {
  cli
    .command('build-docs <routes-mask> <docs-format>')
    .description(descriptionText)
    .option('-O, --outputPath <outputPath>', 'path to output docs files', DEFAULT_OUTPUT_FOLDER)
    .option('--verbose', 'verbose mode')
    .action((routesMask, docsFormat, { outputPath, verbose }) => {
      const absoluteOutputPath = path.resolve(CWD, outputPath);
      const options = {
        realpath: true,
        cwd: CWD,
      };

      const foundedFiles = glob.sync(routesMask, options);

      if (foundedFiles.length === 0) {
        printText('No router files found');

        return;
      }

      if (verbose) {
        printText(foundedFiles
          .map(line => `(finded file) ${line}`)
          .join('\n'));
      }

      const ast = foundedFiles
        .map(require)
        .map(getModel)
        .reduce(concat, []);

      docsGenerators[docsFormat](absoluteOutputPath, ast);
    });
};

