const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    bookName: {type: String, required: true, trim: true},
    slug: {type: String, lowercase: true},

    description: {type:String, required: true, maxlength: 2000},
    category: {type: String, ref: "categories", required: true},
    author: {type: String, ref: "authors", required: true},
    publisher: {type: String, ref: "publishers", required: true},

   

    price: {type:Number, trim: true, required: true},
    quantity: {type: Number},
    isPopular:{type:Boolean ,default: false},
    sellCount: {type: Number, default: 0},
    photoURL: {type:String},
    photoId: {type:String},
    review:[{type:{}}]

},{timestamps: true, versionKey: false});

const bookModel = mongoose.model("books",bookSchema);
module.exports = bookModel;