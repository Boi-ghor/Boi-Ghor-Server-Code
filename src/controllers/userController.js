const UserModel = require('../models/User/User');
const { hashPassword, comparePassword } =require("../helpers/auth.js");
const jwt =require("jsonwebtoken");
require("dotenv").config();


exports.register = async (req, res) => {
    try {
      const { firstName, lastName, email, password, photo } = req.body;
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
        photo
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
          photo: user.photo
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
          email: user.email,
          role: user.role,
          photo: user.photo,
        },
        token,
      });
    } catch (err) {
      console.log(err);
    }
  };

  exports.userProfileUpdate = async (req,res) => {
    try {
      const {firstName,lastName,password} = req.body;
      let user = UserModel.find({_id:req.user._id})
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
      const updated = await UserModel.findByIdAndUpdate(req.user._id,updatedData,{ new: true });
      updated.password = undefined;
      res.json(updated);
    } catch (err) {
      console.log(err)
    }
  }
  
  // exports.checkingLogin =  (req,res) => {
  //   res.json({login:true})
  // }
  
  // exports.checkingAdmin =  (req,res) => {
  //   res.json({admin:true})
  // }