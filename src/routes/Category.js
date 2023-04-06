const express = require("express")
const route = express.Router()

const {create, update} = require("../controllers/categoryController")
const {registerSignIn, isAdmin} = require("../middleware/auth")
  

route.post("/category", registerSignIn, isAdmin, create)
route.put("/category/:id", registerSignIn, isAdmin, update)

module.exports = route;