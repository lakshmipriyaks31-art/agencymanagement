const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    
    productId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    
    isDeleted: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    companyId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    clientId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    item:[itemSchema],
  },
  { timestamps: true }
);
orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Order', orderSchema);