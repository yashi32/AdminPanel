//this file contains all the routes for results

const express = require('express');
const router = express.Router();
const resultsController = require("../controllers/results_controller");


// method for posting result of an interview
router.post('/:interviewId/:studentId',resultsController.updateStudentResult);

module.exports = router;
