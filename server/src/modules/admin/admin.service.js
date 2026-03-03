const adminSchema = require("./admin.model")
const { generatepassword ,comparePassword} = require("../../utils/bcypt")
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwttoken")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { decrypt } = require("dotenv")
const { decryptCrypto } = require("../../utils/crypto")

exports.register =  async(data)=>{
  
         const {username , mobile , password} = data
        console.log(`data fetched ${JSON.stringify(data)}`)
        //Add data to Admin Schema
        let admin = await adminSchema.findOne({
            mobile ,isDeleted:false
        })
        if (admin)  throw new AppError("user already exists",400)
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
        console.log(`data fetched ${JSON.stringify(data)}`)
        //Add data to Admin Schema
        let admin = await adminSchema.findOne({
            mobile,isDeleted:false
        })
        if (!admin)  throw new AppError("no user found",409 )
        // else{
        let comparepassword = await comparePassword(password,admin.password)

        if(!comparepassword)  throw new AppError("Validation Error",[{field:"password",message:"invalid password"}],409 )
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
    console.log("refreshtoken",refreshtoken,id, decryptCrypto(refreshtoken))
    if (result) {
    result.refreshtoken = null;
    await result.save();
   return result
  }
    else  throw new AppError("no user found",409 )
}


exports.profile = async(id)=>{
    var result =await adminSchema.findOne({_id:id,isDeleted:false}).select('-password -refreshtoken -isDeleted')
    return result
    
}
exports.fetchalladmin = async()=>{
   var result =await adminSchema.find({isDeleted:false}).select('username mobile role').sort('-createdAt')
   console.log("result",result)
   return result
    
}

exports.edit =  async(data,_id)=>{
        let {username , mobile , password} = data
        var result =await adminSchema.findOne({mobile,id:{$ne:id},isDeleted:false})
        if(result) throw new AppError("Mobile Number Already Exist",409 )
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
        if (!admin)  throw new AppError("Failed to update",400)
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
        console.log(`data fetched ${JSON.stringify(admin)}`)
        if (!admin)  throw new AppError("Unauthorized user",409 )
        return "ok"
}