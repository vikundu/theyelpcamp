var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create(
//     {
//         name:"Silver Creek", 
//         image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg",
//         description:"One of the most beautiful site you'll see."
//     },function(err,data)
//     {
//         if(err)
//             console.log(err);
//         else
//         {
//             console.log("Campground created..");
//             console.log(data);
//         }
//     });


// var campgrounds=[
        
//         {name:"Granite Hill", image:"https://static.pexels.com/photos/803226/pexels-photo-803226.jpeg"},
//         {name:"Mountain Goat's Rest", image:"https://media1.fdncms.com/csindy/imager/u/original/5599678/summercamping-b3cb0e0608b3c56a.jpg"},
//         {name:"Silver Creek", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
//         {name:"Granite Hill", image:"https://static.pexels.com/photos/803226/pexels-photo-803226.jpeg"},
//         {name:"Mountain Goat's Rest", image:"https://media1.fdncms.com/csindy/imager/u/original/5599678/summercamping-b3cb0e0608b3c56a.jpg"},
//         {name:"Silver Creek", image:"https://s3-us-west-2.amazonaws.com/hispotion-prod/wp-content/uploads/2017/05/31-05101657f53d1a399b7051016886742565-31.jpg"},
//         {name:"Granite Hill", image:"https://static.pexels.com/photos/803226/pexels-photo-803226.jpeg"},
//         {name:"Mountain Goat's Rest", image:"https://media1.fdncms.com/csindy/imager/u/original/5599678/summercamping-b3cb0e0608b3c56a.jpg"}
//         ];

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
    
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err)
       }else{
           //console.log(foundCampground);
           res.render("show",{campgrounds:foundCampground});
       }
        
    });
    
    //res.render("show"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!");
});
