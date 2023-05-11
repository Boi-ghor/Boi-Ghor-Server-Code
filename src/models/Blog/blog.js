const mongoose = require('mongoose');

const commentSchema=mongoose.Schema({
    userId:String,
    name:String,
    comment:String,
})

const blogSchema = mongoose.Schema({
    bloggerEmail: {type: String},
    bloggerName: {type: String},
    title: {type: String},
    blogDetails: {type: String},
    comments: [commentSchema]

},{versionKey: false, timestamps: true});

const blogModel = mongoose.model("blogs",blogSchema);

module.exports = blogModel;