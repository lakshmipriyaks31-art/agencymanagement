const productSchema = require("./product.model")
const companySchema = require("./../company/company.model")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { Conflict, badRequest, Unauthorized, productConflict, unauthoizedUser, failedToUpdate, notFound } = require("../../config/env")

exports.add =  async(data)=>{
        let product = await productSchema.findOne({
            code:data.code,
            companySlug:data.companySlug ,
            isDeleted:false
        })
        if (product)  throw new AppError(productConflict,Conflict,[{"code":productConflict}])
        product = new productSchema(data)
        return await product.save()
}


exports.profile = async(data)=>{
    let id = data
    var result =await productSchema
                .findOne({_id:id,isDeleted:false})
                .select('-isDeleted')
    if (!result)  throw new AppError("Product not found",notFound,[{error:"Product not found"}])
    return result
    
}
exports.list = async()=>{
   var result =await productSchema
                .find({isDeleted:false})
                .select('-isDeleted')
                .sort('-createdAt')
   return result
    
}

exports.edit =  async(data,_id)=>{
        var result =await productSchema.findOne({_id:{$ne:_id},code:data.code,isDeleted:false})
                if(result) throw new AppError(productConflict,Conflict,[{"code":productConflict}])
         let product = await productSchema.findOneAndUpdate(
        {
            _id
        },
        {$set:
            data
        },
        {upsert:true} ).select('-isDeleted')
        if (!product)  throw new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}])
         return product
}

exports.delete =  async(_id)=>{
    
        let product = await productSchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                {isDeleted:true}
            },
            {upsert:true}
        )
       
        if (!product)  throw new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}] )
        return "ok"
}