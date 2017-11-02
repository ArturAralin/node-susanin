const { GET, POST } = require('../../../methods');
const joi = require('joi');
/* Test  */
const testCtrl = ({ reply, user }) => {
  reply({
    user,
    ok: 1,
  });
};

const ctrlWithError = () =>
  Promise
    .resolve()
    .then(() => {
      JSON.parse('invalid');
    });

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
  {
    method: GET,
    path: '/with_catching_error',
    controller: ctrlWithError,
    middlewares: [],
    validation: {},
  },
];
