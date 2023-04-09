const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');

const { registerSignIn } = require("../middleware/auth");
const { createBook } = require("../controllers/bookController");



router.post("/createBook",registerSignIn,formidable(),createBook);




module.exports = router;