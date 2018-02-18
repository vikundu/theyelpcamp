var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log(err)
        else{
            res.render("index",{campgrounds:allCampgrounds});     
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
    res.render("new");
});

app.get("/campgrounds/:id",function(req, res) {
    
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err)
       }else{
           console.log(foundCampground);
           res.render("show",{campgrounds:foundCampground});
       }
        
    });
    
    //res.render("show"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!");
});