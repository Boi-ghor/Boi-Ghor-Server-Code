const express = require("express")
const route = express.Router()

const {register,login, userProfileUpdate} =require("../controllers/userController.js");
const { registerSignIn } = require("../middleware/auth.js");
route.post("/register", register);
route.post("/login",login);
route.put("/updateProfile",registerSignIn,userProfileUpdate);
module.exports = route;