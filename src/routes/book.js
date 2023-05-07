const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');


const { registerSignIn, isAdmin } = require("../middleware/auth");
const { createBook, list, read, remove, updateBook, addReview, braintreeToken, braintreePayment} = require("../controllers/bookController");



router.post("/create-book",registerSignIn,isAdmin,formidable(),createBook);
router.get("/books", list);
router.get("/books/:slug", read);
router.delete("/books/:bookId", registerSignIn, remove);
router.put("/books/:bookId",formidable(), updateBook);
router.post("/add-review",registerSignIn,addReview)

//payment route
//token
router.get("/braintree/token", braintreeToken)

//payments
router.post("/braintree/payment", braintreePayment)









module.exports = router;