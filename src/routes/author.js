const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const { authorList, createAuthor, authorDetails, updateAuthor, remove } = require("../controllers/authorController");
const { registerSignIn } = require("../middleware/auth");



router.post("/createAuthor",registerSignIn,formidable(),createAuthor);
router.get("/authors",authorList);
router.get("/authors/:authorId",authorDetails);
router.post("/updateAuthor/:id",registerSignIn,updateAuthor);
router.get("/delete/:id",registerSignIn,remove);



module.exports = router;