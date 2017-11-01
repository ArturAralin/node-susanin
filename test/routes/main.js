const {
  methods: { GET },
} = require('../../index');

const testCtrl = ({ reply }) => {
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
    path: '/simple',
    controller: testCtrl,
    middlewares: [],
    validation: {
      query: {},
      params: {},
      body: {},
    },
  },
  {
    method: GET,
    path: '/with_middleware',
    controller: testCtrl,
    middlewares: [testMiddleware],
    validation: {
      query: {},
      params: {},
      body: {},
    },
  },
];
