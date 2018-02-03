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
        limit: joi.number(),
        offset: joi.number(),
      },
      params: {
        id: joi.number(),
      },
    },
  },
];
