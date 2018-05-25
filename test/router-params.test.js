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

  return {
    api: supertest(app),
    app,
  };
};

describe('express-object-router router params', () => {
  const {
    api,
    app,
  } = initServer({
    routesPaths: ['./routes/*.js'],
    pathsRelateTo: __dirname,
  });

  it('ctrl.params#reply', async () => {
    const result = await api
      .get('/ctrl/params/reply')
      .then(getData);

    return expect(result)
      .have.property('ok')
      .that.to.be.true;
  });

  it('ctrl.params#reply (promise arg)', async () => {
    const result = await api
      .get('/ctrl/params/replyPromiseArg')
      .then(getData);

    return expect(result)
      .have.property('ok')
      .that.to.be.true;
  });

  it('ctrl.params#reply (promise arg rejection)', async () => {
    const responseText = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>{&quot;ok&quot;:false}</pre>\n</body>\n</html>\n';
    const result = await api
      .get('/ctrl/params/replyPromiseArgRejection');

    return expect(result)
      .to.have.property('text')
      .that.equals(responseText);
  });

  it('ctrl.params#error', async () => {
    let isCalled = false;

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      isCalled = true;

      res.send('');
    });

    await api
      .get('/ctrl/params/error')
      .then(getData);

    return expect(isCalled).to.be.true;
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
