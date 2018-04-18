const { GET } = require('../../methods');

const paramStyle = async ({
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

const fnStyle = async ({
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

module.exports = [
  {
    method: GET,
    path: '/ctrl/params/errorP-param-style',
    controller: paramStyle,
    validation: {},
  },
  {
    method: GET,
    path: '/ctrl/params/errorP-fn-style',
    controller: fnStyle,
    validation: {},
  },
];
