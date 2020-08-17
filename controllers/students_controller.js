// /this file contains all the students controllers, which perfoms functions like get all students or add new student etc.

const Student = require("../models/Student");
const Result = require("../models/Result");

module.exports.showAllStudents = async function(req,res){
    try{
        //if user not signed in then return to the same route from which it is coming
        if(!req.isAuthenticated()){
            req.flash("error", "please sign in before accessing this page");
            return res.redirect("back");
        } 
        //show all students present in DB and populate our page
        let students = await Student.find({});
          
        return res.render('students',{title:'Student', students:students});
    }
    catch(e){
        req.flash("error","something went wrong in fetching students");
        return res.redirect("back");
    }
}


// add Student to the carrer camp report pages
module.exports.addStudent = async function(req,res){
    try{

        if(!req.body.name||!req.body.batch || !req.body.college || !req.body.status|| !req.body.DSA|| !req.body.WebD|| !req.body|| !req.body.React){
            req.flash("error", "Please fill all the fields");
            return res.redirect("back");
        }

        //check for values coming in and match it with enum values
        if(!Student.schema.path("status").enumValues.includes(req.body.status)){
            req.flash("error", "Please fill status out of given");
            return res.redirect("back");
        }

        //if all works create a student.
        let addStudent = await Student.create({
            name: req.body.name,
            batch: req.body.batch,
            college: req.body.college,
            status: req.body.status,
            course:{
                DSA: req.body.DSA,
                WebD:req.body.WebD,
                React: req.body.React
            }
        });

        // send this data for ajax calls purposes
        let students = await Student.find({});
        
        let studentsLength = students.length;

        req.flash("success", "congrats on adding data using ajax");
        return res.json({success: true, message: "Congrats on adding a new student", addStudent:addStudent, studentsLength:studentsLength});
    }
    catch(e){
        req.flash("error","something went wrong in adding student");
         return res.json({success: false,message:e.message});
    }
}



