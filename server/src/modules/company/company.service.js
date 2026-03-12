const companySchema = require("./company.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { Conflict, badRequest, Unauthorized, slugConflict, failedToUpdate, unauthoizedUser, noUserFound, notFound } = require("../../config/env")

exports.add =  async(data)=>{
  
        const {slug } = data
        data.slug = String(slug).toLowerCase().trim().replaceAll(" ", "")
        let company = await companySchema.findOne({
            slug:data.slug ,isDeleted:false
        })
        if (company)  throw new AppError(slugConflict,Conflict,[{slug:slugConflict}])
        company = new companySchema(data)
        return await company.save()
}


exports.profile = async(data)=>{
    let _id = data
    var result =await companySchema.findOne({_id:_id,isDeleted:false})
                .populate({
                        path: "products",
                        select:'productname code item',
                        options: { sort: { createdAt: -1 } }}
                  )
                .select('-isDeleted');
    if (!result)  throw new AppError(noUserFound,notFound,[{error:noUserFound}])
    return result
    
}
exports.list = async()=>{
   var result =await companySchema.find({isDeleted:false}).select('companyname mobile owner slug').sort('-createdAt')
    return result
    
}

exports.edit =  async(data,_id)=>{
       const {slug } = data
        var result =await companySchema.findOne({
            slug,
            _id:{$ne:_id},
            isDeleted:false
        })
        
       
        if(result) throw new AppError(slugConflict,Conflict,[{"slug":slugConflict}] )
        data.slug = String(slug).toLowerCase().trim().replaceAll(" ", "")
        let company = await companySchema.findOneAndUpdate(
        {
            _id:_id
        },
        {$set:
            data
        },
        {upsert:true} ).select('companyname mobile password role')
        if (!company)  throw new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}])
        return company
}

exports.delete =  async(_id)=>{
    
        let company = await companySchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                {isDeleted:true}
            },
            {upsert:true}
        )
       
        if (!company)  throw new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}] )
        return "ok"
}