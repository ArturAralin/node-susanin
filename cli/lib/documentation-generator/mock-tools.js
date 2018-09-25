const proxyquire = require('proxyquire').noCallThru();
const fs = require('fs');

const {
  match,
  pipe,
  map,
  slice,
  ap,
  concat,
  reduce,
  curry,
} = require('ramda');

const matchRequire = pipe(
  match(/require\(.*\)/g),
  map(slice(9, -2)),
);

const matchImport = pipe(
  match(/from.*'.*'/g),
  map(slice(6, -1)),
);

const getImports = pipe(
  v => [v],
  ap([
    matchImport,
    matchRequire,
  ]),
  reduce(concat, []),
);

const createMockObject = (mocks, imports) => mocks
  .map((mock) => {
    const importName = imports.find(importPath => mock.importMask.test(importPath)) || '';

    return {
      ...mock,
      importName,
    };
  })
  .filter(({ importName, importMask }) => importMask.test(importName))
  .reduce((acc, { importName, mock }) => ({
    ...acc,
    [importName]: mock,
  }), {});

const requireWithMocking = curry((mocks, absoluteFileName) => {
  const text = fs.readFileSync(absoluteFileName).toString();
  const imports = getImports(text);
  const mockObject = createMockObject(mocks, imports);

  return proxyquire(absoluteFileName, mockObject);
});

const loadMocksFile = (absoluteFileName) => {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(absoluteFileName);
  } catch (err) {
    return null;
  }
};

module.exports = {
  getImports,
  requireWithMocking,
  loadMocksFile,
};

