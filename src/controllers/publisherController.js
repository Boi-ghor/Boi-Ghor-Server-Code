const publisherModel = require("../models/Publisher/publisher");
const slugify = require("slugify");
const cloudinary = require('cloudinary').v2;

exports.createPublisher = async (req,res) => {
    try {
        const {publisherName,aboutPublisher,sellCount} = req.body;
        const {photo} = req.files;
        switch (true) {
            case !publisherName?.trim():
                return res.json({error: "Publisher name is required"});
            case !aboutPublisher?.trim():
                return res.json({error: "Publisher description is required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        }); 
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Publisher'});
        const publisher = new publisherModel ({...req.body, slug:slugify(publisherName), photoURL: url, photoId: public_id});
        await publisher.save();
        res.json(publisher)
    } catch (err) {
        console.log({console: err})
    }
}


exports.publisherList = async (req,res) => {
    try {
        const publishers = await publisherModel.find({});
        res.status(200).json(publishers);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

exports.publisherDetails = async (req,res) => {
    try {
        const publisherId = req.params.publisherId;
        const publisher = await publisherModel.find({_id: publisherId});
        res.status(200).json(publisher);
    } catch(err) {
        console.log(err);
        res.json(err);
    }
}