//this file contains schema for interviews

const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    date:{
        type:Date,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    package:{
        type:String,
        required:true
    }
    ,
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student'
    }]
},{
    timestamps:true
});

module.exports = mongoose.model('Interview',interviewSchema);