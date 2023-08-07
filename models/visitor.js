const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitorSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Visitor', visitorSchema);