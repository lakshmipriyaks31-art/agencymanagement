const productService = require('./product.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await productService.add(req.body);
  ApiResponse.success(res, result, 'Product added successfully', config.Created);
}
exports.edit = async (req, res) => {
 const result = await productService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Product updated successfully', config.Created);
}
exports.delete = async (req, res) => {
 const result = await productService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Product deleted successfully', config.deleted);
}


exports.profile = async(req,res) => {
  const result =await productService.profile(req.params.id)
  console.log("result",result,req.product)
  ApiResponse.success(res,result,'Listed successfully',config.ok)
}


exports.listallproduct = async(req,res) => {
       const result =await productService.listcompanies()
      return ApiResponse.success(res,result,'Listed successfully',config.ok)
 }