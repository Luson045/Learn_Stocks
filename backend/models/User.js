const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    terms:{
      type:Boolean,
      required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    demat_amnt: {
        type: Number,
        default: 500000,
    },
    investment_amnt: {
      type: Number,
      default: 0,
    },
    net_pl: {
      type: Number,
      default: 0,
    },
    bought_stocks:{
        type: [{
          symbol: String,
          price: Number,
          status: String,
          quantity: Number,
          closedate: Date,
          pl: {
            type: Number,
            default: 0,
          },
        }],
        default: [], // This sets the default value to an empty array
      },
    transaction7: {
        type: [{
          symbol: String,
          price: Number,
          quantity: Number,
          status: String,
          pl: {
            type: Number,
            default: 0,
          },
        }],
        default: [], // This sets the default value to an empty array
      },
    profit:{
        type:Number,
        default:0,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationExpires: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);
