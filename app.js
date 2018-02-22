var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

seedDB();

//PASSPORT Configuration
app.use(require("express-session")({
    secret: "Yelp camp is ready",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing the user information to all the templates
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log(err)
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});     
        }
    });
});

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCamp = {name:name,image:image,description:description};
    Campground.create(newCamp,function(err,newCampground){
        if(err)
            console.log(err);
        else{
            res.redirect("/campgrounds");        
        }
    });
    
});

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err)
       }else{
           //console.log(foundCampground);
           res.render("campgrounds/show",{campgrounds:foundCampground});
       }
        
    });
    
    //res.render("show"); 
});


//comment route
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req, res) {

    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});        
        }
    });
       
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
       if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                    console.log(err);
                else
                {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
                
            });   
        }
    });
});


//==========================
//AUTH Route

app.get("/register",function(req, res) {
   res.render("register"); 
});

app.post("/register",function(req,res){
    var newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login",function(req, res) {
   
   res.render("login"); 
});
 
//handling login logic
app.post("/login",passport.authenticate("local",{
    
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
    
    }),function(req, res) {
   res.send("Login!!");  
});

//logout route
app.get("/logout",function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

//middleware to check if Logged In

function isLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!");
});
