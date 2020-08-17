//this file contains schema for results, contains a mapping between student and interview

const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    result:{
        type:String,
        enum:["Pass","Fail", "Did Not Attempt", "On Hold"],
        required: true
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    interview:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Interview',
        required: true
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Result', resultSchema);