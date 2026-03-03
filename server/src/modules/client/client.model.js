const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    clientname: String,
    address: String,
    mobile: {type:String,required:true,unique:true},
    isDeleted: {
      type: Boolean,
      default: false,
    },
    },
  { timestamps: true }
);
clientSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "clientId", 
  match: { isDeleted: false }

});


clientSchema.set("toJSON", { virtuals: true });
clientSchema.set("toObject", { virtuals: true });
module.exports = mongoose.model('Client', clientSchema);