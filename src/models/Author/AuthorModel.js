const mongoose = require("mongoose");


const authorSchema = mongoose.Schema({
    authorName: {type: String, required: true, trim: true},
    slug: {type:String, lowercase: true},
    aboutAuthor: {type: String, trim: true},
    sellCount: {type: Number, required: true, default: 0},
    photoURL : {type: String},
    photoId : {type:String}
},{timestamps:true, versionKey: false});

const authorModel = mongoose.model("authors",authorSchema);
module.exports = authorModel;