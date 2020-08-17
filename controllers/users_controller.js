// /this file contains all the users/employees controllers, which performs signing/signup/verfying/forgot password a user/employee in. 

const User = require("../models/Employee");
const bcrypt = require('bcryptjs');

//sign up form
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('sign_up',{
        recaptcha: res.recaptcha,
        title:"Sign Up"
    });
}

//sign in form
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('sign_in',{
        recaptcha: res.recaptcha,
        title:"Sign In"
    });
}


//sign up data and send mail to confirm and verify the user
module.exports.createUser = async function(req,res){
    try{
        if(req.body.password != req.body.confirm_password){
            req.flash('error', "Please check your passwords again");
            return res.redirect("back");
        }   
        if (req.recaptcha.error) {
            req.flash("error","Recaptcha Error Hereeeeeee");
            return res.redirect("back");
        } 
        await User.findOne({
            email:req.body.email
        },function(err, user){
            if(err){
                console.log("error in signing up the user");
                return res.redirect("back");
            }
            if(user){
                req.flash('error',"username already exists, please choose another");
                return res.redirect("back");
            }
        });
        
        const hashedPassword = await new Promise((res,rej) =>{
            bcrypt.genSalt(10, function(err,salt){
                bcrypt.hash(req.body.password,salt,function(err,hash){
                    if(err){
                        req.flash("error","error in generating hash");
                        rej(hash);
                        return res.redirect("/sign-up");
                    }
                    res(hash);
                });
            });
        })

        await User.create({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
        }, function(err, user){
            if(err){
                console.log("error in creating a user");
                return res.redirect("back");
            }
            req.flash("success", "new user created successfully");
            return res.redirect('/users/sign-in');
        });
    }
    catch(err){
        req.flash("error",`${err} some error`);
        return res.redirect("back");
    }
}

//create-session after signing in
module.exports.createSession = function(req,res){
    req.flash('success',"You have loggedIn Successfully");
    return res.redirect('/');
}

//sign out fucntionality
module.exports.destroySession = function(req,res){
    req.flash('success',"You have loggedOut successfully");
    req.logout();

    return res.redirect('/');
}