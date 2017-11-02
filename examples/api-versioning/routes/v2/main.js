const {
  methods: { GET },
} = require('../../../../index');

const testCtrl = ({ reply }) => {
  reply({
    version: 2,
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
