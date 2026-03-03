const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productname: String,
    code: {
      type: String,
      required: true,
    },
    companySlug: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);