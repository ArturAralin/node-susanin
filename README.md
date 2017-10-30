# express-object-router
Hapi.js like routing. This library facilitate describing endpoints for REST API servers. The main feature of this library is determining method, path, controller, middlewares, and validation of query object, url object and body object with one object.

Just look at example.

# Example
Library configuration
```javascript
const express = require('express');
const { createRouter } = require('../index');
const path = require('path');

const customMiddleware = (req, res, next) => {
  next();
};

const app = express();

const router = createRouter({
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
```

Describing route
```javascript
const {
  methods: { GET },
} = require('../../index');

const testCtrl = ({ reply, error }) => {
  reply({
    ok: 1,
  });
};

const testMiddleware = (req, res, next) => {
  next();
}; 

module.exports = [
  {
    method: GET,
    path: '/home',
    controller: testCtrl,
    middlewares: [testMiddleware],
    validation: {
      query: {},
      params: {},
      body: {},
    },
  },
];
```

MIT License

Copyright (c) 2017 Artur
