const clientSchema = require("./client.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { Conflict, badRequest, Unauthorized, mobileConflict, failedToUpdate, unauthoizedUser, noUserFound, notFound } = require("../../config/env")

exports.add =  async(data)=>{
  
        const { mobile } = data
        let client = await clientSchema.findOne({
           mobile,isDeleted:false
        })
        if (client)  throw new AppError(mobileConflict,Conflict,[{mobile:mobileConflict}])
        client = new clientSchema(data)
        return await client.save()
}


exports.profile = async(id)=>{
      
    var result =await clientSchema
                .findOne({_id:id,isDeleted:false})
                // .populate({
                //         path: "orders",
                //         select:'productname code item',
                //         options: { sort: { createdAt: -1 } }}
                //   )
                .select('-isDeleted');
    if (!result)  throw new AppError(noUserFound,notFound,[{error:noUserFound}] )
    else return result
    
}
exports.list = async()=>{
   var result =await clientSchema
                    .find({isDeleted:false})
                    .select('-isDeleted')
                    .sort('-createdAt')
   return result
    
}

exports.edit =  async(data,_id)=>{
     let mobileExist = await clientSchema.findOne({
           mobile:data.mobile,isDeleted:false,_id:{$ne:_id}
        })
         if(mobileExist) throw new AppError(mobileConflict,Conflict,[{"mobile":mobileConflict}] )
         let client = await clientSchema.findOneAndUpdate(
        {
            _id,
          
        },
        {$set:
            data
        },
        {upsert:true} ).select('clientname mobile password role')
        if (!client)  throw new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}])
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
            {upsert:true}
        )
        if (!client)  throw new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}] )
        return "ok"
}