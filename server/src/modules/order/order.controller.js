const orderService = require('./order.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await orderService.add(req.body);
  ApiResponse.success(res, result, 'Order added successfully', config.Created);
}
exports.edit = async (req, res) => {
 const result = await orderService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Order updated successfully', config.Created);
}
exports.delete = async (req, res) => {
 const result = await orderService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Order deleted successfully', config.deleted);
}


exports.profile = async(req,res) => {
  const result =await orderService.profile(req?.params?.id)
 
  ApiResponse.success(res,result,'Listed Successfully',config.ok)
}


exports.list = async(req,res) => {
       const result =await orderService.list()
      return ApiResponse.success(res,result,'Listed Successfully',config.ok)
 }