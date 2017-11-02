const express = require('express');
const { createRouter } = require('../index');
const path = require('path');

const customMiddleware = (req, res, next) => {
  req.user = {
    id: 10,
    name: 'John',
    age: 20,
  };

  next();
};

const app = express();

const router = createRouter({
  routePrefix: '',
  extraControllerProps: ['user'],
  routesPath: path.resolve(__dirname, './routes'),
  middlewaresSequence: ({
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    ROUTER_MIDDLEWARES,
  }) => [
    PARAMS_VALIDATION,
    QUERY_VALIDATION,
    BODY_VALIDATION,
    customMiddleware,
    ROUTER_MIDDLEWARES,
  ],
  onValidationError: error => error,
  onReply: data => ({ data }),
});

app.use(router);
app.listen(8080);
