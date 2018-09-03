const { GET } = require('../../../methods');

const testCtrl = ({ reply, user }) => {
  reply({
    user,
  });
};

module.exports = [
  {
    /**
     * @api {get} /home/:part
     * @apiName Get part of home page
     * @apiGroup Home Page
     * @apiDescription Any description about api
     * @apiVersion 0.0.1
     */
    method: GET,
    path: '/home/:part',
    controller: testCtrl,
    validation: {},
  },
  {
    /**
     * @apiName Get part of home page
     * @apiGroup Home Page
     * @apiDescription Any description about api
     */
    method: GET,
    path: '/home/:part/details',
    controller: testCtrl,
    validation: {},
  },
];
