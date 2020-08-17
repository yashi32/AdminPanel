//this file contains all the routes for interview

const express = require('express');
const router = express.Router();
const interviewsController = require("../controllers/interviews_controller");

// route to all list of all the interviews
router.get('/getAllInterviews',interviewsController.showAllInterviews);

// route to post a new interview to the list
router.post('/addInterview',interviewsController.addInterview);


//router to view a particular interview and its details
router.get('/:id',interviewsController.viewInterview);

// router to get students in autocomplete to add in interviews
router.post('/:interviewId/addStudentInterview',interviewsController.addStudentInterview);

module.exports = router;
