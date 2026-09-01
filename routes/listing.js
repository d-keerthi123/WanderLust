const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const { populate } = require("../models/reviews.js");

//index route
router.get("/", wrapAsync (async (req, res) => {
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
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
})

//show route
router.get("/:id",wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing doesn't exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
}));


//create route
router.post("/", isLoggedIn,validateListing, wrapAsync (async (req,res)=>{
   
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync (async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing})
}));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync (async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync (async (req,res)=>{
     let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports=router;