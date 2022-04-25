const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define the schema
const profileSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    win: {
        type: Number,
        required: true
    },
    loss: {
        type: Number,
        required: true
    }

},{ timestamps: true });

//create the model
module.exports.Info = mongoose.model('Info', profileSchema);


