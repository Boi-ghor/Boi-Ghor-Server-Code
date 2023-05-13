const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const { authorList, createAuthor, authorDetails, updateAuthor, remove, bookByAuthor} = require("../controllers/authorController");
const { registerSignIn, isAdmin} = require("../middleware/auth");



router.post("/createAuthor",registerSignIn,isAdmin,formidable(),createAuthor);
router.get("/authors",authorList);
router.get("/authors/:authorId",authorDetails);
router.post("/updateAuthor/:id",registerSignIn,isAdmin,updateAuthor);
router.delete("/deleteAuthor",registerSignIn,isAdmin,remove);
router.get('/book-by-author/:authorName',bookByAuthor)



module.exports = router;