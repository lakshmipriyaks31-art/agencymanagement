const orderService = require('./order.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await orderService.add(req.body);
  ApiResponse.success(res, result, 'Order registered successfully', 201);
}
exports.edit = async (req, res) => {
 const result = await orderService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Order registered successfully', 201);
}
exports.delete = async (req, res) => {
 const result = await orderService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Order deleted successfully', 204);
}


exports.profile = async(req,res) => {
  const result =await orderService.profile(req.params.id)
  console.log("result",result,req.params.id)
  ApiResponse.success(res,result,'Authorised',200)
}


exports.listallorder = async(req,res) => {
       const result =await orderService.list()
      return ApiResponse.success(res,result,'Authorised',200)
 }