const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyname: String,
    slug: String,
    address: String,
    owner: String,
    mobile: String,
    // manager: String,
    // mobile: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
     mobile: {
      type: String,
      required:true,
    }
  },
  { timestamps: true }
);
companySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "companySlug", 
  match: { isDeleted: false }
});
companySchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "companyId", 
  match: { isDeleted: false }
});
companySchema.set("toJSON", { virtuals: true });
companySchema.set("toObject", { virtuals: true });
module.exports = mongoose.model('Company', companySchema);