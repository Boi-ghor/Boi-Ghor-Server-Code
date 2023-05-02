const publisherModel = require("../models/Publisher/publisher");
const slugify = require("slugify");
const cloudinary = require("../helpers/imageUpload");

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

        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Publisher'});
        const publisher = new publisherModel ({...req.body, photoURL: url, photoId: public_id});
        await publisher.save();
        res.status(201).json({success: true, data: publisher})
    } catch (err) {
        console.log({console: err})
        res.status(500).json({success: false, data: err, message: "Publisher not created"})
    }
}


exports.publisherList = async (req,res) => {
    try {
        const publishers = await publisherModel.find({});
        res.status(200).json({success: true, data: publishers});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, data: err, message: "Error in Publisher list"})
    }
}

exports.publisherDetails = async (req,res) => {
    try {
        const publisherId = req.params.publisherId;
        const publisher = await publisherModel.find({_id: publisherId});
        res.status(200).json({success: true, data: publisher});
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, data: err, message: "Error in Publisher details"})
    }
}

exports.updatePublisher = async (req,res) => {
    try {
        const {publisherName,aboutPublisher,sellCount} = req.body;
        // switch (true) {
        //     case !publisherName?.trim():
        //         return res.json({error: "Publisher name is required"});
        //     case !aboutPublisher?.trim():
        //         return res.json({error: "Publisher description is required"});
        //     case !sellCount:
        //         return res.json({error: "sell count is required"});
        // }
        const updatedData = await publisherModel.findByIdAndUpdate({_id: req.params.id}, req.body);
        await updatedData.save();
        res.status(200).json({success: true, data: updatedData, message: "Update successful"});
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "Update fail"})
    }
}
exports.removePublisher = async (req, res) => {
    try {
      const publisher = await publisherModel.findByIdAndDelete({_id:req.params.id})
      res.status(200).json({data:publisher, success: true, message: "deleted"});
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "delete fail"})
    }
  };