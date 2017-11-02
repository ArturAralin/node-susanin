const express = require('express');
const { createRouter } = require('express-object-router');
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
  routePrefix: 'v1',
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
app.listen(8080, () => {
  console.log('Started on 8080');
});
