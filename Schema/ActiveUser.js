var mongoose = require('mongoose');
var schema  = mongoose.Schema;
let ActiveUserSchema = new schema({
    Email:{
        type: String,
        required: true,
        unique: true,
    },
    Access_Token:{
        type: String,
        required: true,
    },
    Refresh_Token:{
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('ActiveUser',ActiveUserSchema);