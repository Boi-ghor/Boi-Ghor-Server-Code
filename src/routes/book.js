const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');

const { registerSignIn } = require("../middleware/auth");
const { createBook, } = require("../controllers/bookController");



router.post("/create-book",registerSignIn,formidable(),createBook);
router.get('/books/:id',)




module.exports = router;