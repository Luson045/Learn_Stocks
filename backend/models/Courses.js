const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "UNDEFINED"
    },content:{
      type: String,
      default: "UNDEFINED"
    },uploaddate:{
      type: Date,
      default: Date.now,
    }
});

module.exports = mongoose.model('Courses', CourseSchema);
