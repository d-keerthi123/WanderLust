const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


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
app.get("/listing", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});