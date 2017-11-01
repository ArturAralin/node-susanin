const { flatten, concat } = require('ramda');
const ExpressPromiseRouter = require('express-promise-router');
const requireTree = require('require-tree');
const { methodsNames } = require('./methods');
const createValidationMiddleware = require('./createValidationMiddleware');
const createController = require('./createController');

const DEFAULT_CONFIGURATION = {
  routePrefix: null,
  onValidationError: error => error,
  onReply: data => ({ data }),
  middlewaresSequence: ({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  }) => [
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  ],
};

const ROUTER_MIDDLEWARES = Symbol('ROUTER_MIDDLEWARES');
const PARAMS_VALIDATION = Symbol('PARAMS_VALIDATION');
const QUERY_VALIDATION = Symbol('QUERY_VALIDATION');
const BODY_VALIDATION = Symbol('BODY_VALIDATION');

const composeMiddlewares = (middlewares, middlewaresSequence) =>
  flatten(middlewaresSequence.map(middleware =>
    (typeof middleware === 'symbol'
      ? middlewares[middleware]
      : middleware)));

module.exports = (config = {}) => {
  const router = ExpressPromiseRouter();

  const {
    routePrefix,
    routesPath,
    middlewaresSequence: middlewaresSequenceFn,
    onReply,
    onValidationError,
  } = Object.assign({}, DEFAULT_CONFIGURATION, config);

  const middlewaresSequence = middlewaresSequenceFn({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  });

  Object
    .values(requireTree(routesPath))
    .reduce(concat)
    .forEach(({
      method,
      path: routePath,
      controller: routeController,
      middlewares: routeMiddlewares,
      validation: {
        params,
        query,
        body,
      },
    }) => {
      const MIDDLEWARES = {
        [ROUTER_MIDDLEWARES]: routeMiddlewares || [],
        [PARAMS_VALIDATION]: createValidationMiddleware('params', onValidationError, params),
        [QUERY_VALIDATION]: createValidationMiddleware('query', onValidationError, query),
        [BODY_VALIDATION]: createValidationMiddleware('body', onValidationError, body),
      };

      const methodName = methodsNames[method];
      const methodFn = router[methodName];
      const middlewares = composeMiddlewares(MIDDLEWARES, middlewaresSequence);
      const controller = createController(onReply, routeController);

      methodFn.apply(router, [
        `${routePrefix ? `/${routePrefix}` : ''}${routePath}`,
        ...middlewares,
        controller,
      ]);
    });

  return router;
};
