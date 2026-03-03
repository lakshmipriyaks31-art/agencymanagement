const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    role: {
      type: String,
      enum: ['admin', 'manager'],
      default: 'manager',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }, mobile: {
      type: String,
      required:true,
    },
    refreshtoken: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);