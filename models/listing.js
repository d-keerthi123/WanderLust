const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./reviews.js");
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
            default:"https://media.istockphoto.com/id/478054193/photo/beautiful-green-countryside-house.jpg?s=1024x1024&w=is&k=20&c=i4tL-w-nEE6E9QgHOU5VnWPbr5m_cQj9w_VVJ8OB_Os=",
            set:(v)=> v === ""
            ? "https://media.istockphoto.com/id/478054193/photo/beautiful-green-countryside-house.jpg?s=1024x1024&w=is&k=20&c=i4tL-w-nEE6E9QgHOU5VnWPbr5m_cQj9w_VVJ8OB_Os="
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
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

//create model
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;