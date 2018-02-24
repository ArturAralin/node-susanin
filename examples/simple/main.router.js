const { GET } = require('../../methods');
const joi = require('joi');
/* Test  */
const testCtrl = ({ reply, user }) => {
  reply({
    user,
    ok: 1,
  });
};

module.exports = [
  {
    method: GET,
    path: '/user/:id',
    controller: testCtrl,
    middlewaresParams: {},
    validation: {
      query: {
        limit: joi.number().min(1).max(10).default(100500)
          .description('super puper')
          .valid([1, 3, 7])
          .disallow([-1, -8, -10]),
        offset: joi.number(),
      },
      params: {
        id: joi.number(),
      },
    },
  },
];
