const UserModel = require('../models/User/User');
const { hashPassword, comparePassword } =require("../helpers/auth.js");
const jwt =require("jsonwebtoken");
const OTPModel = require('../models/OTP/OTPModel');
const SendEmailUtility = require('../utility/SendEmailUtility');
require("dotenv").config();


exports.register = async (req, res) => {
    try {
        console.log('aschi')
      const { firstName, lastName, email, password, } = req.body;
      if (!firstName.trim()) {
        return res.json({ error: "firstName is required" });
      }
      if (!lastName.trim()) {
        return res.json({ error: "lastName is required" });
      }
      if (!email) {
        return res.json({ error: "Email is required" });
      }
      if (!password || password.length < 6) {
        return res.json({ error: "Password must be at least 6 characters long" });
      }
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.json({ error: "Email is taken" });
      }
      const hashedPassword = await hashPassword(password); 
      const user = await new UserModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,

      }).save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      res.status(201).json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          
        },
        token,
      });
    } catch (err) {
      console.log(err);
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.json({ error: "Email is required" });
      }
      if (!password || password.length < 6) {
        return res.json({ error: "Password must be at least 6 characters long" });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.json({ error: "User not found" });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.json({ error: "Invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      res.status(200).json({
        user: {
          firstName: user.firstName,
          lastName:user.lastName,
          email: user.email,
          role: user.role,
          photo: user.photo,
            userId:user._id
        },
        token,
      });
    } catch (err) {
      console.log(err);
    }
  };


  exports.getById=async (req,res)=>{
      try{
         const {userId} =req.params;
         const user=await UserModel.find({_id:userId}).select("-password")
          res.json(user)
      }
      catch (e) {

      }
  }


  exports.userProfileUpdate = async (req,res) => {
    try {
        const userId=req.params.userId
      const {firstName,lastName,password} = req.body;
      let user = UserModel.find({_id:userId})
      if (firstName.length <1) {
        return res.json({error: "FirstName Required"})
      }
      if (lastName.length <1) {
        return res.json({error: "LastName Required"})
      }
      if (password && password.length <6) {
        return res.json({error: "Password is required and should be min 6 characters long"})
      }
      const hashedPassword = password ? await hashPassword(password):undefined;
      const updatedData = {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        password: hashedPassword || user.password
      }
      const updated = await UserModel.findByIdAndUpdate(req.userId,updatedData,{ new: true });
      updated.password = undefined;
      res.json(updated);
    } catch (err) {
      console.log(err)
    }
  }
  
  exports.checkingLogin =  (req,res) => {
    res.json({login:true})
  }
  
  exports.checkingAdmin =  (req,res) => {
    res.json({admin:true})
  }

  exports.RecoverVerifyEmail=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000)
    try {
        let UserCount = (await UserModel.aggregate([{$match: {email: email}}, {$count: "total"}]))
        if(UserCount.length>0){
            let CreateOTP = await OTPModel.create({email: email, otp: OTPCode})
            let SendEmail = await SendEmailUtility(email,"Your PIN Code is= "+OTPCode,"Boi Ghor PIN Verification")
            res.status(200).json({status: "success", data: SendEmail})
        }
        else{
            res.status(200).json({status: "fail", data: "No User Found"})
        }
  
    }catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
  
  }
  
  
  
  
  exports.RecoverVerifyOTP=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = req.params.otp;
    let status=0;
    let statusUpdate=1;
    try {
        let OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}])
        if (OTPCount.length>0) {
            let OTPUpdate = await OTPModel.updateOne({email: email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })
            res.status(200).json({status: "success", data: OTPUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid OTP Code"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
  }
  
  
  
  exports.RecoverResetPass=async (req,res)=>{
  
    let email = req.body['email'];
    let OTPCode = req.body['OTP'];
    let NewPass =  req.body['password'];
    let statusUpdate=1;
  
    try {
        let OTPUsedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: statusUpdate}}, {$count: "total"}])
        if (OTPUsedCount.length>0) {
            let PassUpdate = await UserModel.updateOne({email: email}, {
                password: await hashPassword(NewPass)
            })
            res.status(200).json({status: "success", data: PassUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid Request"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
  }
    