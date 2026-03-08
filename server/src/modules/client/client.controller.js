const clientService = require('./client.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await clientService.add(req.body);
 ApiResponse.success(res, result, 'Client registered successfully', config.Created);
}
exports.edit = async (req, res) => {
 const result = await clientService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Client registered successfully',  config.Created);
}
exports.delete = async (req, res) => {
 const result = await clientService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Client deleted successfully', config.deleted);
}


exports.profile = async(req,res) => {
  console.log("req.params",req.params)
  const result =await clientService.profile(req.params.id)
  console.log("req.params result",result)

  ApiResponse.success(res,result,'Authorised',config.ok)
}


exports.listallclient = async(req,res) => {
       const result =await clientService.listcompanies()
      return ApiResponse.success(res,result,'Authorised', config.ok)
 }