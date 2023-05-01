const mongoose = require("mongoose");

const publisherSchema = mongoose.Schema({
    publisherName: {type: String, required: true, trim: true},
    aboutPublisher: {type: String, trim: true},
    sellCount: {type: String, required: true},
    photoURL : {type: String},
    photoId : {type:String}
},{timestamps: true, versionKey: false});

const publisherModel = mongoose.model("publishers",publisherSchema);
module.exports = publisherModel;