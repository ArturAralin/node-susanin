const express = require('express');
const { createRouter } = require('../../index');
const joi = require('joi');

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
  extraControllerProps: ['user'],
  routesPaths: ['./*.router.js'],
  pathsRelateTo: __dirname,
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
  defaultValidation: {
    query: {
      accessToken: joi.string(),
    },
    body: {},
    params: {},
  },
  onValidationError: error => error,
  onReply: data => ({ data }),
});

app.use(router);
app.listen(8080, () => {
  console.log('Started on 8080');
});
