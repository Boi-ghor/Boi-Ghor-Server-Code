  const slugify = require("slugify");
const authorModel = require("../models/Author/AuthorModel");
const cloudinary = require("../helpers/imageUpload");
  const bookModel = require("../models/Book/book");
require("dotenv").config()


exports.createAuthor = async (req,res) => {
    try {
        const {authorName,aboutAuthor,} = req.body;
        const {photo} = req.files;
        switch (true) {
            case !authorName?.trim():
                return res.json({error: "Author name is required"});
            case !aboutAuthor?.trim():
                return res.json({error: "Author description is required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        const isAuthor=await authorModel.aggregate([{$match:{authorName:authorName}}])
        if(isAuthor.length>0) res.json({error:"this author already exists"})
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Author'});
        const author = new authorModel ({...req.body, photoURL: url, photoId: public_id});
        await author.save();
        res.status(201).json({success: true, data: author})
    } catch (err) {
        console.log({console: err})
        res.status(500).json({success: false, data: err,  message: "Author not created"})
    }
}

exports.authorList = async (req,res) => {
    try {
        const authors = await authorModel.find({});
        res.status(200).json({success: true, data: authors})
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, data: err, message: "Error in author list"})
    }
}

exports.authorDetails = async (req,res) => {
    try {
        const authorId = req.params.authorId;
        const author = await authorModel.find({_id: authorId});
        res.status(200).json({success: true, data: author})
    } catch(err) {
        console.log(err);
        res.status(500).json({success: false, data: err, message: "Error in author details"})
    }
}

exports.bookByAuthor=async (req,res)=>{
    try{
      const {authorName}=req.params;
        const books=  await bookModel.aggregate([
            {
                $match: {
                   author:authorName
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

    }
}

exports.updateAuthor = async (req,res) => {
    try {
        const {authorName,aboutAuthor,sellCount} = req.body;
        // switch (true) {
        //     case !authorName?.trim():
        //         return res.json({error: "Author name is required"});
        //     case !aboutAuthor?.trim():
        //         return res.json({error: "Author description is required"});
        //     case !sellCount:
        //         return res.json({error: "sell count is required"});
        // }
        const updatedData = await authorModel.findByIdAndUpdate({_id: req.params.id}, req.body,{new:true});

        res.status(200).json({success: true, data: updatedData, message: "Update successful"});
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "Update fail"})
    }
}
exports.remove = async (req, res) => {
    const {authorName}=req.params
    try {
        const books=  await bookModel.aggregate([
            {$match:{author:authorName}}
        ])

    if(books.length > 0){
        return res.json({error:"this author have a book ,so u cant delete this author"})
    }else{
            const {_id,photoId}=await authorModel.findOne({authorName:authorName});
            if(!_id && !photoId){
                return res.json({error:"author name not found"})
            }
        await cloudinary.uploader.destroy(photoId);
       await authorModel.findByIdAndDelete(_id)
     return   res.status(200).json({ success: true, message: "deleted successfully"});
    }
    } catch (err) {
        res.status(500).json({success: false, data: err, message: "delete fail"})
    }
  };