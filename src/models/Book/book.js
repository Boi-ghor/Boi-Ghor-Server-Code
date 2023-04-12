const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const bookSchema = mongoose.Schema({
    bookName: {type: String, required: true, trim: true},
    slug: {type: String, lowercase: true},
    description: {type:String, required: true, maxlength: 2000},
    category: {type: ObjectId, ref: "Category", required: true},
    author: {type: ObjectId, ref: "authors", required: true},
    publisher: {type: ObjectId, ref: "publishers", required: true},
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