const  config  = require('../config/env');
const AppError = require('../utils/appError');

exports.adminRoleAuth=(req,re,next)=>{
    let admin = req?.admin?.adminid?.role
    if(admin == config.accessRole){ return next()}
    else throw new AppError("Unauthorized user",config.Unauthorized,{error:"Unauthorized admin"})
}