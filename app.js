const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressErrors.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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


app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

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