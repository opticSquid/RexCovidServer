var mongoose = require('mongoose');
var schema  = mongoose.Schema;
let CentreSchema = new schema({
    Name: {
        type: String,
        required: true,
    },
    Email:{
        type: String,
        required: true,
        unique: true,
    },
    Password:{
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('CovidCentre',CentreSchema);