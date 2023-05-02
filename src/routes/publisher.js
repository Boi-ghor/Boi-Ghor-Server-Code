const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const {createPublisher, publisherList, publisherDetails, updatePublisher, removePublisher} = require("../controllers/publisherController");
const { registerSignIn } = require("../middleware/auth");



router.post("/createPublisher",registerSignIn,formidable(),createPublisher);
router.get("/publishers",publisherList);
router.get("/publishers/:publisherId",publisherDetails);
router.post("/updatePublisher/:id",registerSignIn,updatePublisher);
router.get("/deletePublisher/:id",registerSignIn,removePublisher);



module.exports = router;