const supertest = require('supertest');
const express = require('express');
const { createRouter } = require('../index');
const {
  prop,
} = require('ramda');

const initServer = (config) => {
  const app = express();
  const router = createRouter(config);

  app.use(router);

  return supertest(app);
};

const getBody = prop('body');

module.exports = {
  initServer,
  getBody,
};
