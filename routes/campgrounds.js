var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log(err)
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});     
        }
    });
});

//create a new campground
router.post("/",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author ={
        id:req.user._id,
        username:req.user.username
    }
    var newCamp = {name:name,image:image,description:description,author:author};
    Campground.create(newCamp,function(err,newCampground){
        if(err)
            console.log(err);
        else{
            console.log(newCampground);
            res.redirect("/campgrounds");        
        }
    });
    
});

//create a new campground -- only if you are logged in
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//show a specific campground
router.get("/:id",function(req, res) {
    
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


//render the form for editing a campground
router.get("/:id/edit",function(req, res) {

    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                console.log(err);
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    res.render("campgrounds/edit",{campground:foundCampground});    
                }else{
                    res.send("You do not have permission!");                    
                }
                         
            }
        
        });
    }else{
        res.send("You need to be logged in!!");
    }
    
    
});

//edit a campground
router.put("/:id",function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, foundCampground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


//delete a campground
router.delete("/:id",function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


function isLoggedIn(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;