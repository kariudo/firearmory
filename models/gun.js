var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GunSchema   = new Schema({
    make: String,
    model: String,
    serial: String,
    year: Number,
    type: String,
    optics: String,
    modifications: String,
    condition: {
        score: Number,
        comments: String
    },
    comments: String,
    disposition: {
        disposed: Boolean,
        date: Date,
        comments: String
    }
});

module.exports = mongoose.model('Gun', GunSchema);