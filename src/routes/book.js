const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');


const { registerSignIn, isAdmin } = require("../middleware/auth");
const { createBook,list,read,remove } = require("../controllers/bookController");



router.post("/create-book",registerSignIn,isAdmin,formidable(),createBook);
router.get("/books", list);
router.get("/books/:slug", read);
router.delete("/books/:bookId", registerSignIn, remove);









module.exports = router;