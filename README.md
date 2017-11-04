# express-object-router
This library facilitate describing endpoints for REST API servers. The main feature of this library is secure.

# WARNING! 
___Don't use this library for real projects while version of this library is not stable (i.e. < 1.0.0)___

If you have any ideas or question just leave issue [here](https://github.com/ArturAralin/express-object-router/issues/new)

# Getting Started
Follow to install module

* `npm install express-object-router --save`
* Look example.

# Example
More examples [here](examples)
### Library configuration
```javascript
/* app.js */
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
  routesPath: path.resolve(__dirname, './routes'), /* routes directory  */
  routePrefix: 'v1', /* prefix before every route (i.e. /v1/route/path) */
  extraControllerProps: ['user'], /* properties which will be added to controller from req object */
  middlewaresSequence: ({ /* determining middlewares sequence for every route */
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
  onValidationError: joiError => customErrorWrapper(joiError), /* validation error handler */
  onReply: data => ({ data }), /* reply object builder */
});

app.use(router);
app.listen(8080);
```

### Describing routes
```javascript
/* routes/main.js */
const { GET, POST } = require('express-object-router/methods');
const joi = require('joi');

const testCtrl = ({
  req, /* express req object */
  res, /* express res object */
  next, /* express next function */
  reply, /* function for sending reply to client */
  error, /* function calls error */
  headers, /* headers object from req */
  params, /* req.params */
  body, /* req.body */
  query, /* req.query */
  user, /* property which determined in "extraControllerProps" */
}) => {
  reply({
    user,
    ok: 1,
  });
};

const testMiddleware = ({
  req, /* express req object */
  res, /* express res object */
  next, /* express next function */
  headers, /* req.headers */
  error, /* function calls error */
  pass, /* function pass to next middleware */
  props, /* values from "middlewaresProps" */
  setToReq, /* function assign property to req object */
}) => {
  pass();
};
module.exports = [
  {
    method: GET, /* http method */
    path: '/article', /* route path */
    controller: testCtrl, /* controller function */
    middlewares: [testMiddleware], /* middlewares for this route */
    middlewaresProps: {}, /* props for middleware */
    validation: { /* validation */
      query: {
        limit: joi.number(),
        offset: joi.number(),
      },
      body: {},
      params: {},
    },
  },
];
```

# Notes

#### error function note
If you call error function without arguments, then it return symbol.

MIT License

Copyright (c) 2017 Artur A.
