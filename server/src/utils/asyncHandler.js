const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e)=>next(e));
  };
};

module.exports = asyncHandler;