const {
  flatten,
} = require('ramda');
const ExpressPromiseRouter = require('express-promise-router');
const { methodsNames } = require('./methods');
const createValidationMiddleware = require('./createValidationMiddleware');
const createController = require('./createController');
const middlewareWrapper = require('./middlewareWrapper');
const getRoutesObjects = require('./getRoutesObjects');

const DEFAULT_CONFIGURATION = {
  routePrefix: null,
  pathsRelateTo: undefined,
  extraControllerProps: [],
  onValidationError: error => error,
  onReply: (res, data) => {
    res
      .status(200)
      .json({ data });
  },
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

const DEFAULT_VALIDATION = {
  query: {},
  body: {},
  params: {},
};

const ROUTER_MIDDLEWARES = Symbol('ROUTER_MIDDLEWARES');
const PARAMS_VALIDATION = Symbol('PARAMS_VALIDATION');
const QUERY_VALIDATION = Symbol('QUERY_VALIDATION');
const BODY_VALIDATION = Symbol('BODY_VALIDATION');

const composeMiddlewares = (middlewaresProps, middlewares, middlewaresSequence) =>
  flatten(middlewaresSequence.map(middleware =>
    (typeof middleware === 'symbol'
      ? middlewares[middleware]
      : middleware)))
    .map((middleware) => {
      const argsCount = middleware.length;

      switch (argsCount) {
        case 1:
          return middlewareWrapper(middlewaresProps, middleware);
        case 3:
          return middleware;
        default:
          throw new Error('Invalid middleware. Middleware must have one or three arguments');
      }
    });

module.exports = (config = {}) => {
  const router = ExpressPromiseRouter();

  const {
    routePrefix,
    routesPaths: routerFilePattern,
    pathsRelateTo,
    middlewaresSequence: middlewaresSequenceFn,
    onReply,
    onValidationError,
    extraControllerProps,
    defaultValidation: extraDefaultValidation,
  } = Object.assign({}, DEFAULT_CONFIGURATION, config);

  const routerDefaultValidation = Object
    .keys(DEFAULT_VALIDATION)
    .reduce((acc, key) => {
      const defaultValidation = DEFAULT_VALIDATION[key];
      const customValidation = (extraDefaultValidation && extraDefaultValidation[key]) || {};
      const validation = {
        [key]: Object.assign({}, defaultValidation, customValidation),
      };

      return Object.assign(acc, validation);
    }, {});

  const middlewaresSequence = middlewaresSequenceFn({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  });

  getRoutesObjects(routerFilePattern, pathsRelateTo)
    .forEach(({
      method,
      path: routePath,
      controller: routeController,
      middlewares: routeMiddlewares,
      middlewaresProps,
      validation: {
        params,
        query,
        body,
      },
    }) => {
      const MIDDLEWARES = {
        [ROUTER_MIDDLEWARES]: routeMiddlewares || [],
        [PARAMS_VALIDATION]: createValidationMiddleware(routerDefaultValidation, 'params', onValidationError, params),
        [QUERY_VALIDATION]: createValidationMiddleware(routerDefaultValidation, 'query', onValidationError, query),
        [BODY_VALIDATION]: createValidationMiddleware(routerDefaultValidation, 'body', onValidationError, body),
      };

      const methodName = methodsNames[method];
      const methodFn = router[methodName];
      const middlewares = composeMiddlewares(middlewaresProps, MIDDLEWARES, middlewaresSequence);
      const controller = createController(onReply, extraControllerProps, routeController);
      const fullRoutePath = `${routePrefix ? `/${routePrefix}` : ''}${routePath}`;

      methodFn.apply(router, [fullRoutePath].concat(middlewares).concat([controller]));
    });

  return router;
};
