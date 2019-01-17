const chai = require('chai');

const { expect } = chai;
const {
  initServer,
  getBody,
} = require('./tools');

describe('Middlewares', () => {
  describe('setToProps', () => {
    const api = initServer({
      routesPaths: ['./routes/*.js'],
      pathsRelateTo: __dirname,
    });

    it('setToProps works', async () => {
      const result = await api
        .get('/middlewares/params/set-to-props')
        .then(getBody);

      expect(result.data)
        .to.have.property('isSetToPropsWorks')
        .that.to.equal(true);

      expect(result.data)
        .to.have.property('isTheSameWithMiddlewresProps')
        .that.to.equal(true);
    });

    it('new props object on every call', async () => {
      const result = await api
        .get('/middlewares/params/set-to-props')
        .then(getBody);

      expect(result.data)
        .to.have.property('isSetToPropsWorks')
        .that.to.equal(true);
    });
  });
});
