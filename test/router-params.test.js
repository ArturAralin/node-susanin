const supertest = require('supertest');
const express = require('express');
const { createRouter } = require('../index');
const {
  path,
} = require('ramda');
const chai = require('chai');

const { expect } = chai;
const getData = path(['body', 'data']);

const initServer = (config) => {
  const app = express();
  const router = createRouter(config);

  app.use(router);

  return supertest(app);
};

describe('express-object-router router params', () => {
  const api = initServer({
    routesPaths: ['./routes/*.js'],
    pathsRelateTo: __dirname,
  });

  it('ctrl.params#errorP (param style)', async () => {
    const result = await api
      .get('/ctrl/params/errorP-param-style')
      .then(getData);

    return expect(result)
      .have.property('errorCatched')
      .that.to.be.true;
  });

  it('ctrl.params#errorP (fn style)', async () => {
    const result = await api
      .get('/ctrl/params/errorP-fn-style')
      .then(getData);

    return expect(result)
      .have.property('errorCatched')
      .that.to.be.true;
  });
});
