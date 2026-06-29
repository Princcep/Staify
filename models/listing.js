const mongoose = require("mongoose");
const Review =require("./review.js");
const User = require("./user.js");
const { required } = require("joi");
const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,

    },
    description:{
        type: String,
        required:true,
    },
    image:{
        url: String,
        filename: String,
    },
    price:Number,
    location:String,
    country:String,
    
    reviews :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"review",

        }
    ],

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    geometry:{
        type:{
        type:String,
        enum:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true
    }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id :{$in: listing.reviews}});
    }
});
const listing = mongoose.model("listing",listingSchema);
module.exports = listing;