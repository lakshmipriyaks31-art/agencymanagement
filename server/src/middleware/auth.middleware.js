const { verifyAccessToken, verifyRefreshToken } = require("../utils/jwttoken");
const AppError = require("../utils/appError");
const{Unauthorized, unauthoizedToken, unauthoizedUser, invalidToken} = require('../config/env')
module.exports = (req, res, next) => {
  const token = req.cookies.accessToken;  // 👈 get from cookie
  const refreshtoken = req.cookies.refreshToken;  // 👈 get from cookie
  
  if (!token) {
       return next(new AppError(invalidToken,Unauthorized,[{error:invalidToken}]));
  }
  try {
    const decoded = verifyAccessToken(token);
    const decodedrefresh = verifyRefreshToken(refreshtoken);
    if(decoded?.adminid?.id != decodedrefresh?.adminid?.id)   return next(new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}]));
      req.admin = decoded;
      next();
  } catch (err) {
    return next(new AppError(invalidToken,Unauthorized,[{error:invalidToken}]));
  }
};