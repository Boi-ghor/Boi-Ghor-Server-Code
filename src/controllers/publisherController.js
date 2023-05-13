const publisherModel = require("../models/Publisher/publisher");
const slugify = require("slugify");
const cloudinary = require("../helpers/imageUpload");
const {is} = require("braintree/vendor/querystring.node.js.511d6a2/util");
const bookModel = require("../models/Book/book");
const authorModel = require("../models/Author/AuthorModel");

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
        const isPublisher=await publisherModel.find({publisherName})
        if(isPublisher.length) return res.json({error:"already exists this publisher"})
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
        const {publisherName} = req.params;
        const publisher = await publisherModel.find({publisherName});
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
    const {publisherName}=req.body;
    try {
        const books=  await bookModel.aggregate([
            {$match:{publisher:publisherName}}
        ])

        if(books.length > 0){
            return res.json({error:"this publisher have a book ,so u cant delete this author"})
        }else{
            const {_id,photoId}=await publisherModel.findOne({publisherName});
            if(!_id && !photoId){
                return res.json({error:"author name not found"})
            }
            await cloudinary.uploader.destroy(photoId);
            await publisherModel.findByIdAndDelete(_id)
            return   res.status(200).json({ success: true, message: "deleted successfully"});
        }
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "delete fail"})
    }
};

exports.booksByPublishers=async (req,res)=>{
    try{
        const {publisherName}=req.params;
        const books=  await bookModel.aggregate([
            {
                $match: {
                    publisher:publisherName
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "name",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "author",
                    foreignField: "authorName",
                    as: "author"
                }
            },
            {
                $lookup: {
                    from: "publishers",
                    localField: "publisher",
                    foreignField: "publisherName",
                    as: "publisher"
                }
            }
        ]);
        res.json(books)
    }
    catch (e) {
        console.log(e)
    }
}