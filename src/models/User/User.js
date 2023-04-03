const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type:String, trim: true, required:true},
    lastName: {type:String, trim: true, required:true},
    email: {type:String, unique:true, required:true},
    password: {type:String, min:6, max:32},
    photo: {type:String},
    // photoId: {type:String},
    role: {type:Number, default: 0}
},{timestamps:true, versionKey:false});

const UserModel = mongoose.model("users",userSchema);

module.exports = UserModel;