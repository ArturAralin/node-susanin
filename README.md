# express-object-router
Hapi.js like router. This library facilitate describing endpoints for REST API servers. The main feature of this library is determining method, path, controller, middlewares, and validation of query object, url object and body object with one object.

# WARNING! 
___Don't use this library for real projects while version of this library is not stable (i.e. < 1.0.0)___
# Getting Started
Follow to install module

* `npm install express-object-router --save`
* Look example.

# Example
### Library configuration
```javascript
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
  extraControllerParams: ['user'],
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
  onValidationError: error => customErrorWrapper(error),
  onReply: data => ({ data }),
});

app.use(router);
app.listen(8080);
```

See more examples [here](example)

### Describing routes
```javascript
const {
  methods: { GET, POST },
} = require('express-object-router');
const joi = require('joi');

const testCtrl = ({
  reply,
  error,
  headers,
  params,
  body,
  query,
  user,
}) => {
  reply({
    user,
    ok: 1,
  });
};

const testMiddleware = (req, res, next) => {
  next();
};

module.exports = [
  {
    method: GET,
    path: '/user/:id',
    controller: testCtrl,
    middlewares: [testMiddleware],
    validation: {
      query: {
        limit: joi.number(),
        offset: joi.number(),
      },
      params: {
        id: joi.number(),
      },
    },
  },
  {
    method: POST,
    path: '/user',
    controller: testCtrl,
    middlewares: [testMiddleware],
    validation: {
      body: {
        name: joi.string(),
        age: joi.number(),
      },
    },
  },
];
```

MIT License

Copyright (c) 2017 Artur A.
