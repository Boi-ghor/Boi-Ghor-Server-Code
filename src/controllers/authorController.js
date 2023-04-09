const slugify = require("slugify");
const authorModel = require("../models/Author/AuthorModel");
const cloudinary = require("../helpers/imageUpload");
require("dotenv").config()


exports.createAuthor = async (req,res) => {
    try {
        const {authorName,aboutAuthor,sellCount} = req.body;
        const {photo} = req.files;
        switch (true) {
            case !authorName?.trim():
                return res.json({error: "Author name is required"});
            case !aboutAuthor?.trim():
                return res.json({error: "Author description is required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Author'});
        const author = new authorModel ({...req.body, slug:slugify(authorName), photoURL: url, photoId: public_id});
        await author.save();
        res.json(author)
    } catch (err) {
        console.log({console: err})
    }
}

exports.authorList = async (req,res) => {
    try {
        const authors = await authorModel.find({});
        res.status(200).json(authors);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}

exports.authorDetails = async (req,res) => {
    try {
        const authorId = req.params.authorId;
        const author = await authorModel.find({_id: authorId});
        res.status(200).json(author);
    } catch(err) {
        console.log(err);
        res.json(err);
    }
}