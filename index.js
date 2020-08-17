//this is the main index file to enter the application

const express = require('express');
const port = 8000;
const app = express();
const session = require('express-session');

//MongoStore is required to store sessions in DB
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//flash is required to show flash messages.
const flash = require('connect-flash');
const db = require('./config/mongoose');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const customMware = require('./config/middleware');

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'views'));

app.use('/downloadFile',express.static(__dirname+'/downloadFile'));

app.use(express.static(__dirname+'/assets'));

app.use(express.urlencoded());

app.use(cookieParser());
app.use(expressLayouts);


//middleware to configure the session
app.use(session({
    name:"mockapp",
    secret:"asdfghjkl",
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(10000*60*60)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:"disabled"
    },
    function(err){
        console.log(err||'connect-mongo works fine');
    })
}));

//middlewares for making our authentication system work
app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//middlewares to flash messages on screen
app.use(flash());

app.use(customMware.setFlash);

//middleware that get the routes
app.use('/',require('./routes'));

app.listen(port, (err)=>{
    if(err){
        console.log(`error in running the server on port ${port}`);
    }
    console.log(`server is running on port ${port}`);
});