const adminSchema = require("./admin.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { decrypt } = require("dotenv")
const { decryptCrypto } = require("../../utils/crypto")
const { Conflict, unprocessable_Entity, notFound, badRequest, Unauthorized } = require("../../config/env")

exports.register =  async(data)=>{
  
         const {username , mobile , password} = data
        //Add data to Admin Schema
        let admin = await adminSchema.findOne({
            mobile ,isDeleted:false
        })
        if (admin)  throw new AppError("user already exists",Conflict,{error:"user already exists"})
        // else{
        admin = new adminSchema({
            username,mobile,password    
        })
        admin.password = await generatepassword(password)
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
        if (!admin)  throw new AppError("no user found",notFound,{error:"no user found"} )
        // else{
        let comparepassword = await comparePassword(password,admin.password)

        if(!comparepassword)  throw new AppError("Validation Error",unprocessable_Entity,[{field:"password",message:"invalid password"}])
             const payload = {
              adminid:{id:admin.id,role:admin.role}
            }
        let token = generateAccessToken(payload)
        let refreshtoken = generateRefreshToken(payload)
        admin.refreshtoken = refreshtoken
        await admin.save()
        return {token,refreshtoken}
//    }
}

exports.logout = async(id,refreshtoken)=>{
    // refreshtoken = decryptCrypto(refreshtoken)
    var result =await adminSchema.findOne({_id:id,isDeleted:false,refreshtoken}).select('-password -refreshtoken -isDeleted')
    if (result) {
    result.refreshtoken = null;
    await result.save();
   return result
  }
    else  throw new AppError("no user found",notFound,{error:"no user found"} )
}


exports.profile = async(id)=>{
    var result =await adminSchema.findOne({_id:id,isDeleted:false}).select('-password -refreshtoken -isDeleted')
    return result
    
}
exports.fetchalladmin = async()=>{
   var result =await adminSchema.find({isDeleted:false}).select('username mobile role').sort('-createdAt')
   return result
}

exports.edit =  async(data,_id)=>{
        let { mobile , password} = data
        var result =await adminSchema.findOne({mobile,_id:{$ne:_id},isDeleted:false})
        if(result) throw new AppError("Mobile Number Already Exist",Conflict,{mobile:"Mobile Number already exist"} )
        if(password) data.password = await generatepassword(password)
        let admin = await adminSchema.findOneAndUpdate(
        {
            _id
        },
        {$set:
            data
        },
        {new:true})
        .select('username mobile password role')
        if (!admin)  throw new AppError("Failed to update",badRequest,{error:"Failed to Update"})
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
        if (!admin)  throw new AppError("Unauthorized user",Unauthorized,{error:"Unauthorized user"} )
        return "ok"
}