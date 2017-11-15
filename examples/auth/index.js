const express = require('express');
const { createRouter } = require('../../index');
const path = require('path');

const users = {
  token1: {
    id: 1,
    role: 'admin',
  },
  token2: {
    id: 2,
    role: 'user',
  },
};

const checkAccess = ({
  headers: { authorization: accessToken },
  error,
  pass,
  props: { allowAccess },
  setToReq,
}) => {
  if (allowAccess.includes('everyone')) {
    pass();

    return;
  }

  const user = users[accessToken] || {};

  if (allowAccess.includes(user.role)) {
    setToReq('user', user);

    pass();

    return;
  }

  error('Access denied!');
};

const app = express();

const router = createRouter({
  extraControllerProps: ['user'],
  routesPaths: ['./routes/*.js'],
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
    checkAccess,
    ROUTER_MIDDLEWARES,
  ],
  onValidationError: error => error,
  onReply: data => ({ data }),
});

app.use(router);
app.listen(8080, () => {
  // eslint-disable-next-line no-console
  console.log('Started on 8080');
});
