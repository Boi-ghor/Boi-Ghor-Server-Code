const express = require("express")
const route = express.Router()

const {register,login, userProfileUpdate, RecoverVerifyEmail, RecoverVerifyOTP, RecoverResetPass} =require("../controllers/userController.js");
const { registerSignIn } = require("../middleware/auth.js");
const {getById, checkingLogin, checkingAdmin} = require("../controllers/userController");
const {isAdmin} = require("../middleware/auth");
route.post("/register", register);
route.post("/login",login);
route.put("/updateProfile/:userId",registerSignIn,userProfileUpdate);
route.get("/getProfile/:userId",registerSignIn,getById);

route.get("/RecoverVerifyEmail/:email",RecoverVerifyEmail);
route.get("/RecoverVerifyOTP/:email/:otp",RecoverVerifyOTP);
route.post("/RecoverResetPass",RecoverResetPass);

route.get('/check-user',registerSignIn,checkingLogin)
route.get("/check-admin",registerSignIn,isAdmin,checkingAdmin)

module.exports = route;