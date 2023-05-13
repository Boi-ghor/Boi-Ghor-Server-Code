const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const {createPublisher, publisherList, publisherDetails, updatePublisher, removePublisher, booksByPublishers} = require("../controllers/publisherController");
const { registerSignIn, isAdmin} = require("../middleware/auth");



router.post("/createPublisher",registerSignIn,isAdmin,formidable(),createPublisher);
router.get("/publishers",publisherList);
router.get("/publishers/:id",publisherDetails);
router.get('/books-by-publisher',booksByPublishers)
router.post("/updatePublisher/:id",registerSignIn,isAdmin,updatePublisher);
router.delete("/deletePublisher",registerSignIn,isAdmin,removePublisher);



module.exports = router;