const reply = (responseBuilder, res, data) => {
  res
    .status(200)
    .json(responseBuilder(data));
};

module.exports = (responseBuilder, controllerFn) =>
  (req, res, next) =>
    controllerFn({
      req,
      res,
      next,
      error: next,
      reply: reply.bind(null, responseBuilder, res),
    });
