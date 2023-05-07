const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');


const { registerSignIn, isAdmin } = require("../middleware/auth");
const { createBook, list, read, remove, updateBook, addReview, filterBook, newBook, popularBooks} = require("../controllers/bookController");



router.post("/create-book",registerSignIn,isAdmin,formidable(),createBook);
router.get("/books", list);
router.get("/books/:slug", read);
router.put("/books/:bookId",registerSignIn,isAdmin,formidable(), updateBook);
router.post("/add-review",registerSignIn,addReview);
router.get('/filter-books',filterBook)
router.get('/new-books',newBook);
router.get('/popular-books',popularBooks);
router.delete('/delete-book/:bookId',registerSignIn,isAdmin,remove)









module.exports = router;