//In this file we configure our database and verify the connection
const mongoose  = require('mongoose');

//make the db
mongoose.connect(`mongodb://localhost/careercamp_db`);

//verify the connection
const db = mongoose.connection;

// function on error
db.on('error', console.log.bind(console,"Error in connecting to the db"));

db.once('open',function(){
    console.log("Connected to the DB successfully");
});

module.exports = db;