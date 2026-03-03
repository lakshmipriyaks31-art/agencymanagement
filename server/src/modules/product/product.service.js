const productSchema = require("./product.model")
const companySchema = require("./../company/company.model")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")

exports.add =  async(data)=>{
        let product = await productSchema.findOne({
            code:data.code,
            companySlug:data.companySlug ,
            isDeleted:false
        }).select('code')
        if (product)  throw new AppError("Product already exists",400)
        product = new productSchema(data)
        return await product.save()
    }


exports.profile = async(data)=>{
    let id = data
    var result =await productSchema.findOne({_id:id,isDeleted:false}).select('-isDeleted')
    return result
    
}
exports.listcompanies = async()=>{
   var result =await productSchema.find({isDeleted:false}).select('-isDeleted').sort('-createdAt')
   console.log("result",result)
   return result
    
}

exports.edit =  async(data,_id)=>{
        var result =await productSchema.findOne({_id:{$ne:id},code:data.code,isDeleted:false})
                if(result) throw new AppError("Code is Already Exist",409 )
         let product = await productSchema.findOneAndUpdate(
        {
            _id
        },
        {$set:
            data
        },
        {new:true} ).select('-isDeleted')
        if (!product)  throw new AppError("Failed to update",400)
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
            {new:true}
        )
        console.log(`data fetched ${JSON.stringify(product)}`)
        if (!product)  throw new AppError("Unauthorized user",409 )
        return "ok"
}