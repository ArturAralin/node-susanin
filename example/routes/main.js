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
