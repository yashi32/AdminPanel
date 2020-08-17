//this file contains the local strategy for authentication using passport

const passport = require('passport');

const localStratgy = require('passport-local').Strategy;

const Employee = require('../models/Employee');

//used for hashing of our password
const bcrypt = require('bcryptjs');

passport.use(new localStratgy({
    usernameField: 'email',
    passReqToCallback:true
},function(req,email,password, done){
    if (req.recaptcha.error) {
        req.flash("error","Captcha Error");
        return;
    } 
    Employee.findOne({email:email},function(err, employee){
        if(err){
            req.flash('error',err);
            return done(err);
        }
        bcrypt.compare(password,employee.password,function(err){
            if(err){
                req.flash("error", "Error in deciphering the password using bcrypt");
                return done(err);
            }

            return done(null, employee);

            // req.flash("error","Invalid Password or couldn't decipher it using bcypt");
            // return done(null,false);
        });
    })
}));


passport.serializeUser(function(employee,done){
    done(null,employee.id);
});


passport.deserializeUser(function(id, done){
    Employee.findById(id,function(err, employee){
        if(err){
            console.log("Error in passport");
            return done(err);
        }
        return done(null,employee);
    })
});

//check for authentication of a user
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }

    return res.redirect('/users/sign-in');
} 

//set the user in locals so that we could use it for authentication purposes
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.employee = req.user;
    }
    next();
}

module.exports = passport;