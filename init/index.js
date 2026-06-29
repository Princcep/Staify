const mongoose  = require("mongoose");
const initdata = require("../init/data.js");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("connected to DB");
}).catch((e)=>{
    console.log(e);
})
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/Staify_db');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6a2fe770fd24086674b3798f"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();