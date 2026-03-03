const companySchema = require("./company.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")

exports.add =  async(data)=>{
  
        const {companyname ,slug,owner,address, mobile } = data
        data.slug = String(slug).toLowerCase().trim().replaceAll(" ", "")
        let company = await companySchema.findOne({
            slug:data.slug ,isDeleted:false
        }).select('slug')
        if (company)  throw new AppError("slug already exists",400)
        company = new companySchema(data)
        return await company.save()
}


exports.profile = async(data)=>{
    let id = data
    var result =await companySchema.findOne({_id:id,isDeleted:false})
                .populate({
                        path: "products",
                        select:'productname code item',
                        options: { sort: { createdAt: -1 } }}
                  )
                .select('-isDeleted');
    return result
    
}
exports.listcompanies = async()=>{
   var result =await companySchema.find({isDeleted:false}).select('companyname mobile owner slug').sort('-createdAt')
   console.log("result",result)
   return result
    
}

exports.edit =  async(data,_id)=>{
       const {slug } = data
        var result =await companySchema.findOne({id:{$ne:id},slug,isDeleted:false})
          if(result) throw new AppError("Slug is Already Exist",409 )
        data.slug = String(slug).toLowerCase().trim().replaceAll(" ", "")
           let company = await companySchema.findOneAndUpdate(
        {
            _id
        },
        {$set:
            data
        },
        {new:true} ).select('companyname mobile password role')
        if (!company)  throw new AppError("Failed to update",400)
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
            {new:true}
        )
        console.log(`data fetched ${JSON.stringify(company)}`)
        if (!company)  throw new AppError("Unauthorized user",409 )
        return "ok"
}