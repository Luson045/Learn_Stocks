const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Miscellaneous"
    },
    rating:{
      type: Number,
      default: 5,
    },
    review:{
      type: String,
      required: true,
    },
});

module.exports = mongoose.model('Ratings', RatingSchema);
