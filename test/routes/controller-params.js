const {
  GET,
} = require('../../methods');

const replyCtrl = ({
  reply,
}) => {
  reply({
    ok: true,
  });
};

const replyPromiseArgCtrl = ({
  reply,
}) => {
  const promise = Promise.resolve({
    ok: true,
  });

  reply(promise);
};

const replyPromiseArgRejectionCtrl = ({
  reply,
}) => {
  // eslint-disable-next-line prefer-promise-reject-errors
  const promise = Promise.reject({ ok: false });

  reply(promise);
};

const errorPParamStyleCtrl = async ({
  errorP,
  reply,
}) => {
  const asyncFn = async () => {
    throw new Error();
  };

  try {
    await asyncFn()
      .catch(errorP({ errorCatched: true }));
  } catch (err) {
    reply(err);
  }
};

const errorPfnStyleCtrl = async ({
  errorP,
  reply,
}) => {
  const asyncFn = async () => {
    throw new Error();
  };

  try {
    const err = { errorCatched: true };
    await errorP(err, asyncFn());
  } catch (err) {
    reply(err);
  }
};

const errorFnCtrl = ({
  error,
}) => {
  error({
    fail: true,
  });
};

module.exports = [
  {
    method: GET,
    path: '/ctrl/params/errorP-fn-style',
    controller: errorPfnStyleCtrl,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/errorP-param-style',
    controller: errorPParamStyleCtrl,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/reply',
    controller: replyCtrl,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/replyPromiseArg',
    controller: replyPromiseArgCtrl,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/replyPromiseArgRejection',
    controller: replyPromiseArgRejectionCtrl,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/error',
    controller: errorFnCtrl,
    validation: {},
  },
];
