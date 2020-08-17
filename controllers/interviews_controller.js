//this file contains all the methods related to interviews like adding a new interview, fetching all interviews etc.

const Interview = require('../models/Interview');
const Result = require('../models/Result');
const Student = require('../models/Student');

// get the list of all the interviews being lined up.
module.exports.showAllInterviews = async function(req,res){
    try{
        //check for user authentication
        if(!req.isAuthenticated()){
            req.flash("error", "please sign in before accessing this page");
            return res.redirect("back");
        } 
        let interviews = await Interview.find({});
                    
        // render the ejs file
        return res.render('interview',{title:'Interview',interviews:interviews });
    }
    catch(e){
        req.flash("error","something went wrong in fetching students");
        return res.redirect("back");
    }
}


// function to add 
module.exports.addInterview = async function(req,res){
    try{
        // check if user has filled all the values in form
        if(!req.body.company||!req.body.date|| !req.body.package){
            req.flash("error", "Please fill all the fields");
            return res.redirect("back");
        }

        // if all works, create an interview
        let addInterview = await Interview.create({
            company: req.body.company,
            package:req.body.package,
            date: req.body.date,
        });

        // send this data for ajax call purposes
        let interviews = await Interview.find({});
        
        let interviewsLength = interviews.length;

        return res.json({success: true, message: "Congrats on adding a new interview", addInterview:addInterview, interviewsLength:interviewsLength});
    }
    catch(e){
        req.flash("error","something went wrong in adding student");
         return res.json({success: false,message:e.message});
    }
}

//view the details of an interview, like a list of all the students who are a part of it and for company make the details available
module.exports.viewInterview = async function(req,res){
    try{
        //check for user authentication
        if(!req.isAuthenticated()){
            req.flash("error", "please sign in before accessing this page");
            return res.redirect("back");
        }
        
        //dynamic data to be sent using params in request
        let interview = await Interview.findById(req.params.id);

        // find all the students to send it using ajax autocomplete method
        let studentsArray = await Student.find({});

        // create students array to send onlty those students presnt in the interview list
        let students = [];

        //create an object for student and its result mapping and sending it to render in autopopulate the dropdown/selectpicker
        let studentResult  = {};
        for(let i =0;i<interview.students.length;i++){
            let student = await Student.findById(interview.students[i]);
            students.push(student);
             await Result.findOne({student:student},
                    function(err,result){
                        if(!result){
                            studentResult[student._id] = "Did Not Attempt";  
                        }
                        else{
                            studentResult[student._id] = result;
                        }
                    }
            );
        }
        // console.log("ResultLog-->", studentResult);
        if(req.xhr){
            //used for autocomplete
            return res.json({success: true, message: "Congrats on autocompleting new student",studentsArray:studentsArray});
        }

        //used for ejs 
        return res.render('viewInterview',{title: interview.company,interview:interview, students:students,studentResult:studentResult});
    }
    catch(e){
        req.flash("error", "something went wrong in accessing interview using ID");
        return res.json({success: false,message: "Catching the error here in viewInterview " +e.message});
    }
} 


//this function is used for adding student in the interview section 
module.exports.addStudentInterview = async function(req,res){
    try{
        if(!req.body.student){
            req.flash("error", "Please fill all the fields");
            return res.redirect("back");
        }

        let student = await Student.findById(req.body.student);

        if(!student){
            req.flash("error", "no such student exist");
            return res.redirect("back");
        }

        //dynamic data of interview is being sent through params
        let interview =  await Interview.findById(req.params.interviewId);

        if(!interview){
            req.flash("error", "no such interview exist");
            return res.redirect("back");
        }

        //update interview as well as students model
        interview.students.push(student);
        student.interviews.push(interview);

        await interview.save();
        await student.save();

        let studentsLength = interview.students.length;

        //ajax calls
        return res.json({success:true, message:"congrats on adding a new student to interview",student:student,studentsLength:studentsLength});
        
    }
    catch(e){
        req.flash("error", "something went wrong in adding student to interview using ID");
        return res.json({success: false,message: "Catching the error here in addStudentInterview" +e.message});
    }
}