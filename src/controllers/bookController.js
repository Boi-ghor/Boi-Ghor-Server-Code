const bookModel = require("../models/Book/book");
const cloudinary = require("../helpers/imageUpload");
const slugify = require("slugify");

exports.createBook = async (req,res) => {
    try {
        const {bookName,description,price,quantity,sellCount,category,author,publisher} = req.body;
        const {photo} = req.files;
        switch (true) {
            case !bookName?.trim():
                return res.json({error: "Book name is required"});
            case !description?.trim():
                return res.json({error: "Book description is required"});
            case !price?.trim():
                return res.json({error: "Price required"});
            case !quantity?.trim():
                return res.json({error: "Quantity required"});
            case photo && photo.size > 1000000:
                return res.json({error: "Image required and it should be less then 1 MB"});
        }
        const {url, public_id} = await cloudinary.uploader.upload(photo.tempFilePath, {folder: 'Book'});
        const book = new bookModel ({...req.body, slug:slugify(bookName), photoURL: url, photoId: public_id});
        await book.save();
        res.json(book)
    } catch (err) {
        console.log({console: err})
    }
}