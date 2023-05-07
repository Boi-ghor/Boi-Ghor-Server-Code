const express = require("express")
const route = express.Router()

const {create, update, remove, list, read, booksByCategory} = require("../controllers/categoryController")



const {registerSignIn, isAdmin} = require("../middleware/auth")


route.post("/category", registerSignIn, isAdmin, create)
route.put("/category/:id", registerSignIn, isAdmin, update)
route.delete("/delete-category/:categoryName", registerSignIn, isAdmin, remove)

route.get("/categories", list)
route.get("/category/:categoryName", read)
route.get("/book-by-category/:categoryName", booksByCategory)


module.exports = route;