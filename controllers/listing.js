const Listing= require("../models/listing.js");
module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res) => {

    let url = req.file.path;
    let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);

    newListing.image = { url, filename };
    newListing.owner = req.user._id;

    const location = req.body.listing.location;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
            headers: {
                "User-Agent": "Staify"
            }
        }
    );

    const data = await response.json();

    if (data.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(data[0].lon),
                parseFloat(data[0].lat)
            ]
        };
    }
    if(data.length==0){
        req.flash("error","Location not found");
        return res.redirect("/listings/new");
    }

    await newListing.save();

    req.flash("success", "new listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    let originalImgUrl= listing.image.url;
    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs", {listing,originalImgUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!=="undefined"){
         let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","listing deleted");
     res.redirect("/listings");
}