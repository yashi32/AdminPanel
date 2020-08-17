// this file contains all the methods required for results, like adding, updating them
const Interview =  require("../models/Interview");
const Student = require("../models/Student");
const Result = require("../models/Result");

//this function lets you update student details during placement, like pass, fail etc.
// we are getting dynamic data through params 
module.exports.updateStudentResult = async function(req,res){
    try{
        console.log("req params is", req.params);
        if(!Result.schema.path('result').enumValues.includes(req.body.selectpicker)){
            console.log("please heck enum values");
            throw new Error('Result Status Value is not Valid.');
        }

        //find the student whose result you want to update/create
        let student = await Student.findById(req.params.studentId);

        if(!student){
            console.log("no student found");
            throw new Error('Student not found.');
        }


        //find the result of the student if it exists otherwise update it
        await Result.findOne({
            student:req.params.studentId
        },function(err, result){
            if(err){
                console.log("error in finding the student");
                return;
            }
            if(!result){
                let result = Result.create({
                    result: req.body.selectpicker,
                    interview: req.params.interviewId,
                    student: req.params.studentId
                });
                if(!result){
                    console.log("error in creating result");
                    return;
                }
                return res.json({success:true,message:"congrats on adding a new student",result:result});

            }
            else{
                result.result = req.body.selectpicker;
                result.save();
                return res.json({success:true, message:"congrats on updating a new student",result:result});
            }

        });
        
        
    }
    catch(e){
        req.flash("error","cannot update student, please check methods again");
        console.log("error in add student result");
        res.redirect("back");
    }
}