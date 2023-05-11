const blogModel = require("../models/Blog/blog");
const UserModel = require("../models/User/User");

exports.createBlog = async (req,res) => {
    try{
        let bloggerDetails = await UserModel.find({_id: req.user["_id"]},{_id:0,email:1,firstName:1,lastName:1});
        req.body['bloggerEmail'] = bloggerDetails[0]['email'];
        req.body['bloggerName'] = bloggerDetails[0]['firstName']+" " +bloggerDetails[0]['lastName'];
        const data = await blogModel.create(req.body);
        return res.status(200).json({success: true, data: data});
    } catch(err) {
        return res.status(400).json({success: false, data: err.toString()});
    }
}

exports.allBlogs = async (req,res) => {
    try{
        let bloggerDetails = await UserModel.find({_id: req.user["_id"]},{_id:0,email:1});
        const data = await blogModel.aggregate([{$match: {bloggerEmail: bloggerDetails[0]['email']}},{$project:{comments:0}}]);
        return res.status(200).json({success: true, data: data});
    } catch(err) {
        return res.status(400).json({success: false, data: err.toString()});
    }
}
exports.updateBlog = async (req,res) => {
    try{
        const id = req.params.id;
        const data = await blogModel.updateOne({_id: id},req.body);
        return res.status(200).json({success: true, data: data});
    } catch(err) {
        return res.status(400).json({success: false, data: err.toString()});
    }
}
exports.deleteBlog = async (req,res) => {
    try{
        const id = req.params.id;
        const data = await blogModel.deleteOne({_id: id});
        return res.status(200).json({success: true, data: data});
    } catch(err) {
        return res.status(400).json({success: false, data: err.toString()});
    }
}

