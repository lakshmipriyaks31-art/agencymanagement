const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwttoken");
const AppError = require("../utils/appError");
const { decryptCrypto } = require("../utils/crypto");

module.exports = (req, res, next) => {
  const token = req.cookies.accessToken ||req.headers.cookie;  // 👈 get from cookie
  const refreshtoken = (req.cookies.refreshtoken);  // 👈 get from cookie
  console.log("token",req.headers.cookie, req.cookies.accessToken )
  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }
  try {
    const decoded = verifyAccessToken(token);
    const decodedrefresh = verifyRefreshToken(refreshtoken);
    if(decoded?.adminid?.id != decodedrefresh?.adminid?.id)   return next(new AppError("Invalid or expired token", 401));
      req.admin = decoded;
      next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }
};