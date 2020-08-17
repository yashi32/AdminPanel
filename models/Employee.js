//this file contains schema for employees, the main users of this app.
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps:true
});

// / generating a hash
employeeSchema.methods.generateHash = function (password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(10), null);
  };


//  checking if password is valid
employeeSchema.methods.validPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('Employee', employeeSchema);