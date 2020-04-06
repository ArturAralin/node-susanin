const {
  concat,
  propEq,
} = require('ramda');
const path = require('path');
const getModel = require('./routes-ast');
const docsGenerators = require('./generators');
const apidocParser = require('./apidoc-parser');
const {
  printText,
} = require('./generators/tools');
const {
  requireWithMocking,
  loadMocksFile,
} = require('./mock-tools');

const CWD = process.cwd();
const DEFAULT_OUTPUT_FOLDER = path.resolve(CWD, './');

const descriptionText = `Params specification:

  <docs-format> - Output documentation format
  [routes...] - Route path. (example: /path/to/my.router.js)

  Supported docs format:
    apidoc - Simple inline docs for RESTful api
`;

const mergeRouteInfo = (route, routeInfo) => ({
  ...route,
  name: route.name || routeInfo.name,
  description: route.description || routeInfo.description,
  version: route.version || routeInfo.version,
  group: route.group || routeInfo.group,
});

const relateRoutesInfo = (routesInfo, ast) =>
  ast.map((item) => {
    const { method, path: routePath } = item;
    const routeInfo = routesInfo.find(propEq('id', `${method}${routePath}`.toLowerCase()));

    if (!routeInfo) {
      return item;
    }

    return mergeRouteInfo(item, routeInfo);
  });


module.exports = (cli) => {
  cli
    .command('build-docs <docs-format> [routes...]')
    .description(descriptionText)
    .option('-O, --outputPath <outputPath>', 'path to output docs files', DEFAULT_OUTPUT_FOLDER)
    .option('--mockFile <mockFilePath>')
    .option('--autoUpdateVersion', 'Auto update version')
    .option('--verbose', 'verbose mode')
    .action((docsFormat, routes, {
      outputPath,
      verbose,
      autoUpdateVersion,
      mockFile: mockFilePath = null,
    }) => {
      const absoluteOutputPath = path.resolve(CWD, outputPath);
      const absoluteRoutesPaths = routes.map(relativePath => path.resolve(CWD, relativePath));
      const mocks = mockFilePath !== null
        ? loadMocksFile(path.resolve(CWD, mockFilePath))
        : [];


      if (absoluteRoutesPaths.length === 0) {
        printText('No router files found');

        return;
      }

      if (verbose) {
        printText(absoluteRoutesPaths
          .map(line => `(found file) ${line}`)
          .join('\n'));
      }

      const routesInfo = absoluteRoutesPaths
        .map(apidocParser)
        .reduce(concat, []);

      const ast = relateRoutesInfo(routesInfo, absoluteRoutesPaths
        .map(requireWithMocking(mocks))
        .map(getModel)
        .reduce(concat, []));

      docsGenerators[docsFormat]({
        absoluteOutputPath,
        ast,
        autoUpdateVersion,
      });
    });
};

