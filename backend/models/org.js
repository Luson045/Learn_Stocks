// backend/models/org.js
const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
    org_name: {
        type: String,
    },
    symbol: {
        type: String,
        required: true,
    },
    current_price: {
        type: Number,
        required: true,
    },
    historical_data:[{ 
      datetime: String,
      price: Number,
    }],
    pl:{
        type:Number,
        required:true,
    },
    last_updated: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Org', orgSchema);


