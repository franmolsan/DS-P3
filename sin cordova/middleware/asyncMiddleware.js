const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next); // pasar error al siguiente middleware
  };

module.exports = asyncMiddleware;