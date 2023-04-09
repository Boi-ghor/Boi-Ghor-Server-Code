const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const bookSchema = mongoose.Schema({
    bookName: {type: String, required: true, trim: true},
    slug: {type: String, lowercase: true},
    description: {type:{}, required: true, maxlength: 2000},
    category: {type: ObjectId, ref: "Category", required: true},
    author: {type: ObjectId, ref: "authors", required: true},
    publisher: {type: ObjectId, ref: "publishers", required: true},
    price: {type:Number, trim: true, required: true},
    quantity: {type: Number},
    sellCount: {type: Number, default: 0},
    photoURL: {type:String},
    photoId: {type:String}

},{timestamps: true, versionKey: false});

const bookModel = mongoose.model("books",bookSchema);
module.exports = bookModel;