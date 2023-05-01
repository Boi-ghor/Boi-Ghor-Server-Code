const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const { authorList, createAuthor, authorDetails } = require("../controllers/authorController");
const { registerSignIn } = require("../middleware/auth");



router.post("/createAuthor",registerSignIn,formidable(),createAuthor);
router.get("/authors",authorList);
router.get("/authors/:slug/:authorId",authorDetails);



module.exports = router;