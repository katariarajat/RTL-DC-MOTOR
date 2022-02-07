// Authentication libraries
const dotenv = require('dotenv');
const express = require("express");
const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
dotenv.config();

// Load User model
const User = require("../models/Users");

// connection with passportjs

// stategy for user sign up
passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done){
        process.nextTick(function() {
            User.findOne({'email':username}, function(err, user){
                if(err){
                    return done(err);
                }
                if(user){
                    return done(null, false, { message: 'Oops! That email is already taken.' });
                } 
                else{
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        sessions: [],
                    });
                    newUser.password = newUser.generateHash(password);
                    newUser.save()
                        .then(user => done(null, user))
                        .catch(err => { throw err});
                }
            });
        });
    }
));

// stategy for user sign in
passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'email': username }, function (err, user) {
                    if (err) { 
                        return done(err); 
                    }
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
  

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    User.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json({
                success: true,
                res : users
            });
		}
	});
});



// POST request 
// Sign UP
router.post('/signup', async function(req, res, next) {
    await console.log("NEWUSER")
    passport.authenticate('local-signup', function(err, user, info) {
        // console.log('Checkpoint');
        let response = {
            success : false,
            res : "",
            email : ""
        };
      if (err) { 
          console.log("ERROR!!!!")
        return next(err); 
      }
      if (!user) { 
          response.success = false;
        //   response.email = req.body.email;
          response.res = "That email is already taken.";
        return res.json(response); 
      }
      else{
        response.success = true;
        response.res = "Successfully Registered";
        response.email = req.body.email;
        console.log("sending back");
        return res.json(response);
         
      }
    })(req, res, next);
  }
);
  

// POST request 
// Sign In
router.post('/signin', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
        let response = {
            success: false,
            res : "",
            email : ""
        };

    if (err) { 
        return next(err); 
    }
    if (!user) { 
        response.success = false;
        // response.email = req.body.email;

        response.res = "Either mail or Password is wrong or not registered user";
        return res.json(response); 
    }
    req.logIn(user, function(err) {
        if (err) { 
        return next(err); 
        }
        response.success = true;
        response.res = "Welcome!";
        response.email = req.body.email;

        return res.json(response);

    });
    })(req, res, next);
});


// GET request 
// Sign Out
router.get("/signout", function(req, res){
  if(req.isAuthenticated()){
    req.logout();
    res.json({success: true,res: "Successfull Signout"});
  }
  else{
    res.json({success: false, res: "Not Authenticated"});
  }
});


// GET request 
// Check Logged or not
router.get('/checklog',function(req, res){
    console.log("Hello");       
    // console.log(req);
    if(req.isAuthenticated()){
        console.log(req.user);
        User.findOne({'email': req.user.email},function(err, user){
            console.log(user);
            if(err){
                console.log(err);
            }
            else{
                res.json({success: true, res:"Authenticated",user_email: user.email});
            }
        });
    }
    else{
        console.log("NOOOO");
        res.json({success: false, res:"Not Authenticated"});
    }
});


module.exports = router;