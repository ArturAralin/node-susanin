const symbols = {
  GET: Symbol('GET'),
  PUT: Symbol('PUT'),
  POST: Symbol('POST'),
  DELETE: Symbol('DELETE'),
  HEAD: Symbol('HEAD'),
  CONNECT: Symbol('CONNECT'),
  OPTIONS: Symbol('OPTIONS'),
  TRACE: Symbol('TRACE'),
  PATCH: Symbol('PATCH'),
};


const methodsNames = {
  [symbols.GET]: 'get',
  [symbols.POST]: 'post',
  [symbols.PUT]: 'put',
  [symbols.DELETE]: 'delete',
  [symbols.CONNECT]: 'connect',
  [symbols.HEAD]: 'head',
  [symbols.OPTIONS]: 'options',
  [symbols.TRACE]: 'trace',
};

module.exports = {
  methodsNames,
  symbols,
};
