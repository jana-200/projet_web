const express = require('express');
const router = express.Router();

const User = require('../models/User.js');

const validator = require('validator');

// Get the log in form
router.get('/login', (req, res) => {
    if(!req.session.user){
    res.render('users/login.hbs', { errors:req.session.errors });
    req.session.errors=null;
    }else{
        res.redirect('/');
    }
   
    
});

// Connect the user
router.post('/login', (req, res) => {
    const user = User.login(req.body.email,req.body.password);
    req.session.errors =[];

    const email =req.body.email.toString();
     
    if (!email.endsWith('.vinci.be') && !email.endsWith('@vinci.be')) {
       req.session.errors.push("The email must be of the domain @vinci.be");
    }
        
    if (user) {
     req.session.user = user;
     req.session.emailId= User.findByEmail(req.body.email);
        if(user.status==="coach"){ 
            req.session.coach=true;
        }
       
        res.redirect('/');
    } else {
        req.session.errors.push('Invalid email or password');
        res.redirect('/users/login');
    }
});

//Get the tournament creation form if I am a coach
router.get('/create', (req, res) => {
    let mistakes = req.session.mistakes;
    req.session.mistakes = null;
    if(!req.session.user){
        res.render('users/create.hbs', {mistakes});
    }else{
        res.redirect('/');
    }
   
    
});

//Create a tournament and redirect to tournament list
router.post('/create', (req, res) => {
    req.session.mistakes = [] ; 
    
    // test if firstname and surname are Alphanumeric
    if(!validator.isAlphanumeric(req.body.firstname)){
       req.session.mistakes.push("The firstname must only contain alphanumeric characters");
    }
    if(!validator.isAlphanumeric(req.body.lastname)){
        req.session.mistakes.push("The surname must only contain alphanumeric characters");
     }
     // test password
     if(!validator.isStrongPassword(req.body.password,{minLength:8,minLowercase:1,minUppercase:1,minNumbers: 1, minSymbols: 0, returnScore: false,})){
        req.session.mistakes.push("The password must contain at least 8 characters and contain at least 1 lowerCase, 1 upperCase and 1 digit number ");
     }

     // test to see if password matches confirmation password 
     if(req.body.password!=req.body.confirmationPassword){
        req.session.mistakes.push("The password and confirmation password must match");
     }
     // test on the email
     const  email=req.body.email.toString();
     
     if (!email.endsWith('.vinci.be') && !email.endsWith('@vinci.be')) {
        req.session.mistakes.push("The email must be of the domain @vinci.be");
     }
    
     if(User.findByEmail(email)!=undefined){
        req.session.mistakes.push("This email already exists, please select another one");
     }
   
     if(req.session.mistakes.length>0){
        res.redirect('/users/create');
        return;
    }
    
    User.create(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
    res.redirect('/users/login');

});
// Disconnect the user
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;