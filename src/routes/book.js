const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');

const { registerSignIn } = require("../middleware/auth");
const { createBook,list,read } = require("../controllers/bookController");



router.post("/createBook",registerSignIn,formidable(),createBook);
router.get("/books", list);
router.get("/books/:slug", read);




module.exports = router;