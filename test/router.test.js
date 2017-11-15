const supertest = require('supertest');
const express = require('express');
const { createRouter } = require('../index');
const { prop } = require('ramda');
const chai = require('chai');

const { expect } = chai;
const getBody = prop('body');

const initServer = (config) => {
  const app = express();
  const router = createRouter(config);

  app.use(router);

  return supertest(app);
};

describe('Test router', () => {
  describe('With default configuration', () => {
    const api = initServer({
      routesPaths: ['./routes/*.js'],
      pathsRelateTo: __dirname,
    });

    it('GET request', async () => {
      const result = await api
        .get('/simple')
        .then(getBody);

      return expect(result)
        .have.property('data')
        .that.have.nested.property('ok', 1);
    });
  });

  describe('With custom response', () => {
    const api = initServer({
      routesPaths: ['./routes/*.js'],
      pathsRelateTo: __dirname,
      onReply: data => ({ customProp: data }),
    });

    it('GET request', async () => {
      const result = await api
        .get('/simple')
        .then(getBody);

      return expect(result)
        .have.property('customProp')
        .that.have.nested.property('ok', 1);
    });
  });

  describe('With custom validation error', () => {
    const api = initServer({
      routesPaths: ['./routes/*.js'],
      pathsRelateTo: __dirname,
      onValidationError: () => 'Oops. Error',
    });

    it('GET request', async () => {
      const result = await api
        .get('/simple')
        .query({ excessParam: 1 })
        .then(prop('text'));

      return expect(result)
        .to.includes('Oops. Error');
    });
  });

  describe('With routes prefix', () => {
    const api = initServer({
      routesPaths: ['./routes/*.js'],
      pathsRelateTo: __dirname,
      routePrefix: 'v1',
    });

    it('GET request', async () => {
      const result = await api
        .get('/v1/simple')
        .then(getBody);

      return expect(result)
        .have.property('data')
        .that.have.nested.property('ok', 1);
    });
  });
});
