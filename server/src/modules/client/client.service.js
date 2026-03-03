const clientSchema = require("./client.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")

exports.add =  async(data)=>{
  
        const { mobile } = data
        let client = await clientSchema.findOne({
           mobile,isDeleted:false
        })
        if (client)  throw new AppError("slug already exists",400)
        client = new clientSchema(data)
        return await client.save()
}


exports.profile = async(data)=>{
    let id = data
    
    var result =await clientSchema.findOne({_id:id,isDeleted:false})
                // .populate({
                //         path: "orders",
                //         select:'productname code item',
                //         options: { sort: { createdAt: -1 } }}
                //   )
                .select('-isDeleted');
    return result
    
}
exports.listcompanies = async()=>{
   var result =await clientSchema.find({isDeleted:false}).select('-isDeleted').sort('-createdAt')
   console.log("result",result)
   return result
    
}

exports.edit =  async(data,_id)=>{
     let mobileExist = await clientSchema.findOne({
           mobile:data.mobile,isDeleted:false,_id:{$ne:_id}
        })
        if(mobileExist) throw new AppError("Mobile Number Already Exist",409 )
         let client = await clientSchema.findOneAndUpdate(
        {
            _id,
          
        },
        {$set:
            data
        },
        {new:true} ).select('clientname mobile password role')
        if (!client)  throw new AppError("Failed to update",400)
         return client
}

exports.delete =  async(_id)=>{
    
        let client = await clientSchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                {isDeleted:true}
            },
            {new:true}
        )
        console.log(`data fetched ${JSON.stringify(client)}`)
        if (!client)  throw new AppError("Unauthorized user",409 )
        return "ok"
}