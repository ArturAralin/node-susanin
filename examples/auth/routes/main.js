const { GET } = require('../../../methods');

const testCtrl = ({ reply, user }) => {
  reply({
    user,
  });
};

module.exports = [
  {
    method: GET,
    path: '/home',
    controller: testCtrl,
    validation: {},
    middlewaresProps: {
      allowAccess: ['everyone'],
    },
  },
  {
    method: GET,
    path: '/user',
    controller: testCtrl,
    validation: {},
    middlewaresProps: {
      allowAccess: ['admin', 'user'],
    },
  },
];
