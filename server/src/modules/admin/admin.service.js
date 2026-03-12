const adminSchema = require("./admin.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { decrypt } = require("dotenv")
const { decryptCrypto } = require("../../utils/crypto")
const { Conflict, unprocessable_Entity, notFound, badRequest, Unauthorized, mobileConflict, noUserFound, unauthoizedUser, failedToUpdate } = require("../../config/env")

exports.register =  async(data)=>{
  
        const {username , mobile , password} = data
        //Add data to Admin Schema
        let admin = await adminSchema.findOne({
            mobile ,isDeleted:false
        })  
        if (admin)  throw new AppError(mobileConflict,Conflict,[{mobile:mobileConflict}])
  
        data.password = await generatepassword(password)
        admin = new adminSchema(data)
        await admin.save()
        // sign token with model id with expiration
        const payload = {
            adminid:{id:admin.id,role:admin.role}
        }
      
        let token = generateAccessToken(payload)
        let refreshtoken = generateRefreshToken(payload)
        admin.refreshtoken = refreshtoken
        await admin.save()
        return {token,refreshtoken,username}
//    }
}

exports.login =  async(data)=>{
  
         const { mobile , password} = data
        //Add data to Admin Schema
        let admin = await adminSchema.findOne({
            mobile,isDeleted:false
        })
        if (!admin)  throw new AppError(noUserFound,notFound,{error:noUserFound} )
        // else{
        let comparepassword = await comparePassword(password,admin.password)

        if(!comparepassword)  throw new AppError("Validation Error",unprocessable_Entity,[{field:"password",message:"invalid password"}])
             const payload = {
              adminid:{id:admin.id,role:admin.role}
            }
        let token = generateAccessToken(payload)
        let refreshtoken = generateRefreshToken(payload)
            console.log("__admin",admin)
        let _id = admin._id
        await adminSchema.findOneAndUpdate(
            {_id},
            {$set:{refreshtoken}},
            {upsert:true})
        return {token,refreshtoken}
//    }
}

exports.logout = async(id,refreshtoken)=>{
    // refreshtoken = decryptCrypto(refreshtoken)
    var result =await adminSchema.findOne(
                {_id:id,isDeleted:false,refreshtoken}
                )
    console.log("++{{",result)            
    if (result) {
         await adminSchema.findOneAndUpdate(
            {_id:result._id},
            {$set:{refreshtoken:null}},
            {upsert:true})
        return true
    }
    else  throw new AppError(noUserFound,notFound,[{error:noUserFound}] )
}


exports.profile = async(id)=>{
    var result =await adminSchema
                .findOne({_id:id,isDeleted:false}) 
                .select('-password -refreshtoken -isDeleted')
    if(!result) throw new AppError(noUserFound,notFound,[{error:noUserFound}] )
    else return result
}

exports.list = async()=>{
   var result =await adminSchema
                    .find({isDeleted:false})
                    .select('username mobile role')
                    .sort('-createdAt')
   return result
}

exports.edit =  async(data,_id)=>{
        let { mobile , password} = data
        var result =await adminSchema.findOne({mobile,_id:{$ne:_id},isDeleted:false})
        if(result) throw new AppError(mobileConflict,Conflict,[{mobile:mobileConflict}] )
        if(password) data.password = await generatepassword(password)
        let admin = await adminSchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                data
            },
            {upsert:true})
        .select('username mobile password role')
        if (!admin)  throw new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}])
        return admin
}

exports.delete =  async(_id)=>{
    
        let admin = await adminSchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                {isDeleted:true,refreshtoken:''}
            },
            {upsert:true}
        )
        if (!admin)  throw new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}] )
        return "ok"
}