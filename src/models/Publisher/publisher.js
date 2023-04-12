const mongoose = require("mongoose");

const publisherSchema = mongoose.Schema({
    publisherName: {type: String, required: true, trim: true},
    slug: {type:String, lowercase: true},
    aboutPublisher: {type: String, trim: true},
    sellCount: {type: String, required: true,default:0},
    photoURL : {type: String},
    photoId : {type:String}
},{timestamps: true, versionKey: false});

const publisherModel = mongoose.model("publishers",publisherSchema);
module.exports = publisherModel;