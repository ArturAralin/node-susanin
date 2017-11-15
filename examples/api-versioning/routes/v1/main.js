const { GET } = require('../../../../methods');

const testCtrl = ({ reply }) => {
  reply({
    version: 1,
  });
};

module.exports = [
  {
    method: GET,
    path: '/version',
    controller: testCtrl,
    validation: {},
  },
];
