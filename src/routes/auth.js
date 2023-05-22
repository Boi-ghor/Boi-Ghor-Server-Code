const express = require("express")
const route = express.Router()

const {register,login, userProfileUpdate, RecoverVerifyEmail, RecoverVerifyOTP, RecoverResetPass, getAllUsers, makeAdmin} =require("../controllers/userController.js");
const { registerSignIn } = require("../middleware/auth.js");
const {getById, checkingLogin, checkingAdmin} = require("../controllers/userController");
const {isAdmin} = require("../middleware/auth");
route.post("/signup", register);
route.post("/signin",login);
route.put("/updateProfile/:userId",registerSignIn,userProfileUpdate);
route.get("/getProfile/:userId",registerSignIn,getById);

route.get("/RecoverVerifyEmail/:email",RecoverVerifyEmail);
route.get("/RecoverVerifyOTP/:email/:otp",RecoverVerifyOTP);
route.post("/RecoverResetPass",RecoverResetPass);

route.get('/check-user',registerSignIn,checkingLogin)
route.get("/check-admin",registerSignIn,isAdmin,checkingAdmin)


route.get("/getUsers",registerSignIn,isAdmin,getAllUsers);
route.put("/updateRole/:id",registerSignIn,isAdmin,makeAdmin);

module.exports = route;