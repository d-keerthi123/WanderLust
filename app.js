if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressErrors.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const flash=require("connect-flash");


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


const sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    //track session
    cookie:{
        expires:Date.now() +1000*60*60*24*3, // milliseconds in 3days
        maxAge:1000*60*60*24*3,
        httpOnly:true
    },
};


//root
app.get("/",(req,res)=>{
    res.send("This is root");
})


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());//middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success"); 
    res.locals.errorMsg=req.flash("error");
     res.locals.currUser=req.user; 
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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