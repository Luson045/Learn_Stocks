const mongoose = require('mongoose');

const AllSchema = new mongoose.Schema({
    names: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('All', AllSchema);
