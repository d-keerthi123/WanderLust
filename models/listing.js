const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
const { required } = require("joi");
const listingSchema=new Schema({
    title:{
        type:String,
         required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        filename: { 
            type: String,

        },
        url: {
            type: String,
            default:"",
            set:(v)=> v === "https://unsplash.com/photos/a-beautiful-pool-and-resort-in-tropical-setting-YKvvujLOUzU"
            ? "https://unsplash.com/photos/a-beautiful-pool-and-resort-in-tropical-setting-YKvvujLOUzU"
            :v,
        },
        
    },
    price:{
        type:Number,
        
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],

    owner:{
        type:Schema.Types.ObjectId,
            ref:"User",
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true,
        },
    },

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

//create model
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;