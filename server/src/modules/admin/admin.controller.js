const asyncHandler = require('../../utils/asyncHandler');
const adminService = require('./admin.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('./../../config/env');

exports.register = async (req, res) => {
 const {token,refreshtoken,username} = await adminService.register(req.body);
     res
            .cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            })
            res.cookie("refreshToken", refreshtoken, {
              httpOnly: true,
              secure: false, // true in production
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000
            });
  ApiResponse.success(res, username, 'Admin registered successfully', 201);
}
exports.edit = async (req, res) => {
 const result = await adminService.edit(req.body,req?.params?.id);
     res
            .cookie("accessToken", result, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            })
  ApiResponse.success(res, result, 'Admin registered successfully', 201);
}
exports.delete = async (req, res) => {
 const result = await adminService.delete(req.params?.id);
 res.clearCookie("accessToken")
 ApiResponse.success(res, result, 'Admin deleted successfully', 204);
}
exports.logout = async (req, res) => {
 const result = await adminService.logout(req.admin?.adminid?.id, req.cookies.refreshToken);
 res.clearCookie("accessToken")
 res.clearCookie("refreshToken")
 ApiResponse.success(res, result, 'Admin Logout successfully', config.ok);
}

exports.login = async (req, res) => {
 const  {token,refreshtoken} = await adminService.login(req.body);
   res
            .cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            })
             res.cookie("refreshToken", refreshtoken, {
              httpOnly: true,
              secure: false, // true in production
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000
            });
  ApiResponse.success(res, token, 'Admin login successfully', config.ok);
} 

exports.profile = async(req,res) => {
  const result =await adminService.profile(req.params.id)
  if(!result){
         res.clearCookie("accessToken")
         throw new AppError('Unauthorised',config.Unauthorized,{error:'Unauthorised'})
        }
  else ApiResponse.success(res,result,'Authorised',config.ok)
}


exports.list = async(req,res) => {
      const result =await adminService.fetchalladmin()
      return ApiResponse.success(res,result,'Authorised',config.ok)
 }