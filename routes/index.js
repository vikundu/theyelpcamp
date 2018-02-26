var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user"); 

//landing page
router.get("/",function(req,res){
    res.render("landing");
});

//Register a new user
router.get("/register",function(req, res) {
   res.render("register"); 
});

//Create a registered user
router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp"+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req, res) {
   res.render("login"); 
});
 
//handling login logic
router.post("/login",passport.authenticate("local",{
    
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
    
    }),function(req, res) {
   res.send("Login!!");  
});

//logout route
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Logged you out!!");
   res.redirect("/campgrounds");
});

//middleware to check if Logged In

function isLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;