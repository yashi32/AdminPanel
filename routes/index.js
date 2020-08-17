const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
   return res.render('home',{title:'Carrer Camp'});
});

//various routes for user
router.use('/users',require("./users"));


// routes for students
router.use('/students',require("./students"));


//routes for interviews
router.use('/interviews',require("./interviews"));

//routes for getting or updating results
router.use('/results',require("./results"));


//route for downloading the file
//router.use('/download', require("./download"));

module.exports = router;