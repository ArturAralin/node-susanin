const {
  GET,
  POST,
} = require('../../methods');
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
        id: joi.string().default('xxx'),
      },
      body: {
        isAdmin: joi.boolean().truthy().falsy('N').insensitive(),
        from: joi.date(),
      },
    },
    info: {
      name: 'API Name',
      description: 'This is test description',
      version: '1.0.0',
      group: 'SUPER PUPER',
    },
  },
  {
    method: GET,
    path: '/user1/:id',
    controller: testCtrl,
    middlewaresParams: {},
  },
  {
    method: POST,
    path: '/u2ser1/:id',
    controller: testCtrl,
    middlewaresParams: {},
    validation: {
      body: joi.number()
        .default(100500)
        .allow(10)
        .allow(20)
        // .min(100)
        .max(200),
      query: {
        x: joi.object().keys({
          key1: joi.string(),
        }),
      },
    },
  },
];
