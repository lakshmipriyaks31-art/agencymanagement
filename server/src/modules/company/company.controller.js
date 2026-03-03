const companyService = require('./company.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await companyService.add(req.body);
 ApiResponse.success(res, result, 'Company registered successfully', 201);
}
exports.edit = async (req, res) => {
 const result = await companyService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Company registered successfully', 201);
}
exports.delete = async (req, res) => {
 const result = await companyService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Company deleted successfully', 204);
}


exports.profile = async(req,res) => {
  const result =await companyService.profile(req.params.id)
  console.log("result",result,req.params.id)
  ApiResponse.success(res,result,'Authorised',200)
}


exports.listallcompany = async(req,res) => {
       const result =await companyService.listcompanies()
      return ApiResponse.success(res,result,'Authorised',200)
 }