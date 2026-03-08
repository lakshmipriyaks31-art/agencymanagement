const companyService = require('./company.service');
const ApiResponse = require('../../utils/apiResponse');
const AppError = require('../../utils/appError');
const  config  = require('../../config/env');

exports.add = async (req, res) => {
 const result = await companyService.add(req.body);
 ApiResponse.success(res, result, 'Company registered successfully', config.Created);
}
exports.edit = async (req, res) => {
 const result = await companyService.edit(req.body,req?.params?.id);
 ApiResponse.success(res, result, 'Company Updated successfully', config.Created);
}
exports.delete = async (req, res) => {
 const result = await companyService.delete(req.params?.id);
 ApiResponse.success(res, result, 'Company deleted successfully', config.deleted);
}


exports.profile = async(req,res) => {
  const result =await companyService.profile(req.params.id)
  ApiResponse.success(res,result,'Listed Successfully',config.ok)
}


exports.listallcompany = async(req,res) => {
       const result =await companyService.listcompanies()
      return ApiResponse.success(res,result,'Listed Successfully',config.ok)
 }