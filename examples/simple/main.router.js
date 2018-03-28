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
        limit: joi.number()
          .integer()
          .positive()
          .min(1)
          .max(10)
          .default(100500)
          .description('super puper')
          .valid([1, 3, 7])
          .disallow([-1, -8, -10])
          .tags(['a', 'b'])
          .tags('x')
          .notes('xxxx'),
        offset: joi.string()
          .alphanum()
          .base64()
          .creditCard()
          .email()
          .guid()
          .hex()
          .hostname()
          .insensitive()
          .ip()
          .isoDate()
          .length(1)
          .lowercase()
          .max(10)
          .min(1),
      },
      params: {
        id: joi.number(),
      },
    },
  },
];
