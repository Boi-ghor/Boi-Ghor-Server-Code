const express = require("express")
const route = express.Router()


const {create, update, remove, list, read, booksByCategory} = require("../controllers/categoryController")

const {registerSignIn, isAdmin} = require("../middleware/auth")


route.post("/category", registerSignIn, isAdmin, create)
route.put("/category/:id", registerSignIn, isAdmin, update)
route.delete("/delete-category/:id", registerSignIn, isAdmin, remove)

route.get("/categories", list)
route.get("/category/:slug", read)
route.get("/book-by-category/:slug", booksByCategory)

route.get("/categories", list)

module.exports = route;