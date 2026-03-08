const orderSchema = require("./order.model")
const companySchema = require("../company/company.model")
const AppError = require("../../utils/appError")
const logger = require("../../config/logger")
const { badRequest, Unauthorized, failedToUpdate, unauthoizedUser } = require("../../config/env")

exports.add =  async(data)=>{
        data.orderId = await orderSchema.find({}).sort({ _id: -1 }).limit(1)
        console.log("data.orderId",data.orderId)
        data.orderId=data.orderId[0]?.orderId?Number(data.orderId[0].orderId)+1:0
        let order = new orderSchema(data)
        return await order.save()
    }


exports.profile = async(id)=>{
    var result =await orderSchema.findOne({_id:id,isDeleted:false})
                 .populate({
                        path: "companyId",
                        select:'companyname address mobile',
                        options: { sort: { createdAt: -1 } }}
                  )
                  .populate({
                        path: "clientId",
                        select:'clientname address mobile',
                        options: { sort: { createdAt: -1 } }}
                  )
                   .populate({
                        path: "item.productId",
                        select: "productname item"
                    })
                .select('-isDeleted')
    // var products = await productSchema.find()
    return result
    
}
exports.list = async()=>{
   var result =await orderSchema.find({isDeleted:false})
                    .populate({
                        path: "companyId",
                        select:'companyname address mobile',
                        options: { sort: { createdAt: -1 } }}
                  )
                  .populate({
                        path: "clientId",
                        select:'clientname address mobile',
                        options: { sort: { createdAt: -1 } }}
                  ).select('-isDeleted').sort('-createdAt')
   console.log("result",result)
   return result
    
}

exports.edit =  async(data,_id)=>{
         let order = await orderSchema.findOneAndUpdate(
        {
            _id
        },
        {$set:
            data
        },
        {new:true} ).select('-isDeleted')
        if (!order)  throw new AppError(failedToUpdate,badRequest,[{error:failedToUpdate}])
         return order
}

exports.delete =  async(_id)=>{
    
        let order = await orderSchema.findOneAndUpdate(
            {
                _id
            },
            {$set:
                {isDeleted:true}
            },
            {new:true}
        )
        if (!order)  throw new AppError(unauthoizedUser,Unauthorized,[{error:unauthoizedUser}] )
        return "ok"
}