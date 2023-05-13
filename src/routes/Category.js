const express = require("express")
const route = express.Router()

const {create, update, remove, list, read, booksByCategory} = require("../controllers/categoryController")



const {registerSignIn, isAdmin} = require("../middleware/auth")


route.post("/category", registerSignIn, isAdmin, create)
route.put("/category/:id", registerSignIn, isAdmin, update)
route.delete("/delete-category", registerSignIn, isAdmin, remove)

route.get("/categories", list)
route.get("/categories/:_id", read)
route.get("/book-by-category", booksByCategory)


module.exports = route;