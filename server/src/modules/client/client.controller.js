const clientService = require('./client.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await clientService.add(req.body);
 ApiResponse.success(res, result, 'Client registered successfully', 201);
}
exports.edit = async (req, res) => {
 const result = await clientService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Client registered successfully', 201);
}
exports.delete = async (req, res) => {
 const result = await clientService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Client deleted successfully', 204);
}


exports.profile = async(req,res) => {
  console.log("req.params",req.params)
  const result =await clientService.profile(req.params.id)
  ApiResponse.success(res,result,'Authorised',200)
}


exports.listallclient = async(req,res) => {
       const result =await clientService.listcompanies()
      return ApiResponse.success(res,result,'Authorised',200)
 }