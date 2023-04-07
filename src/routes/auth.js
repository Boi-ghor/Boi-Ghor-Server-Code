const express = require("express")
const route = express.Router()

const {register,login, userProfileUpdate, RecoverVerifyEmail, RecoverVerifyOTP, RecoverResetPass} =require("../controllers/userController.js");
const { registerSignIn } = require("../middleware/auth.js");
route.post("/register", register);
route.post("/login",login);
route.put("/updateProfile",registerSignIn,userProfileUpdate);

route.get("/RecoverVerifyEmail/:email",RecoverVerifyEmail);
route.get("/RecoverVerifyOTP/:email/:otp",RecoverVerifyOTP);
route.post("/RecoverResetPass",RecoverResetPass);

module.exports = route;