const express = require("express")
const route = express.Router()

const {register,login, userProfileUpdate, RecoverVerifyEmail, RecoverVerifyOTP, RecoverResetPass} =require("../controllers/userController.js");
const { registerSignIn } = require("../middleware/auth.js");
const {getById} = require("../controllers/userController");
route.post("/register", register);
route.post("/login",login);
route.put("/updateProfile/:userId",registerSignIn,userProfileUpdate);
route.get("/getProfile/:userId",registerSignIn,getById);

route.get("/RecoverVerifyEmail/:email",RecoverVerifyEmail);
route.get("/RecoverVerifyOTP/:email/:otp",RecoverVerifyOTP);
route.post("/RecoverResetPass",RecoverResetPass);

module.exports = route;