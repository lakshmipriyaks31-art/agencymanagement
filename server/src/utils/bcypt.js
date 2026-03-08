const bcrypt = require("bcryptjs")

exports.generatepassword = async(password)=>{
         const salt = await bcrypt.genSalt()
          return await bcrypt.hash(password,salt)
}

exports.comparePassword =  async(password,hashedPassword)=>{
         return await bcrypt.compare(password,hashedPassword)
}

