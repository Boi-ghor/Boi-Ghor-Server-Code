const express = require("express");
const { registerSignIn, isAdmin} = require("../middleware/auth");
const { createBlog, allBlogs, updateBlog, deleteBlog } = require("../controllers/blogController");
const router = express.Router();

router.post("/createBlog",registerSignIn,createBlog);
router.get("/readBlogs",registerSignIn,allBlogs);
router.put("/updateBlog/:id",registerSignIn,updateBlog);
router.delete("/delete/:id",registerSignIn,deleteBlog);

module.exports = router;