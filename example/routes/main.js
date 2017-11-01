const {
  methods: { GET, POST },
} = require('../../index');
const joi = require('joi');

const testCtrl = ({ reply, user }) => {
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
