const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressErrors.js");
const {listingSchema}=require("./schema.js");


async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');
}
main().then(()=>{
    console.log("Connected To Database");
}).catch((err)=>{
    console.log(err);
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

//schema validation- middleware
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next(); 
    }
};
//root
app.get("/",(req,res)=>{
    res.send("This is root");
})

//test listing
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"New Villa",
//         description:"By beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });
//     // await sampleListing.save();
//     console.log("Sample was saved!"); 
//     res.send("Successful testing!");
// })

//index route
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("./listings/index.ejs", { allListings });

// });

app.get("/listings", wrapAsync (async (req, res) => {
    const allListings = await Listing.find({});

    allListings.forEach((listing) => {
        console.log(
            listing.title,
            "=>",
            listing.price,
            "=>",
            typeof listing.price
        );
    });

    res.render("./listings/index.ejs", { allListings });
}));
//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})

//show route
app.get("/listings/:id",wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing})
}));
//create route
app.post("/listings", validateListing, wrapAsync (async (req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing!");
    // }

    
    const newListing=new Listing(req.body.listing);

    // if(!newListing.title){
    //     throw new ExpressError(400,"Title is misssing!");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description is misssing!");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"Location is missing!");
    // }

    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync (async (req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing!");
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync (async (req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Catch-all route
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Error handling middleware
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong!"}=err;
    // res.send("Something went wrong!!");
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});