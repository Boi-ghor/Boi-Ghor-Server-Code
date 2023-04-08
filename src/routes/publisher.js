const express = require("express")
const router = express.Router()
const formidable = require('express-formidable-v2');
const {createPublisher, publisherList, publisherDetails} = require("../controllers/publisherController");
const { registerSignIn } = require("../middleware/auth");



router.post("/createPublisher",registerSignIn,formidable(),createPublisher);
router.get("/publishers",publisherList);
router.get("/publishers/:slug/:publisherId",publisherDetails);



module.exports = router;