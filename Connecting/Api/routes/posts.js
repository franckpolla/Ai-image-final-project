import express from "express";

import {
  getSinglePost,
  getUserPosts,
  likePost,
  deletePost,
  dislikePost,
  getPostsController,
  createPostWithImages_V3,
} from "../controllers/postController.js";

const router = express.Router();

// Get all posts
router.get("/all", getPostsController);

// Get single post by id
router.get("/single/:postId", getSinglePost);

// create v3 post with images
router.post("/create/v3/:userId", createPostWithImages_V3);

//like a post
router.post("/like/:postId/:userId", likePost);

// dislike a post
router.post("/dislike/:postId/:userId", dislikePost);
// delete a post
router.delete("delete/:postId", deletePost);
// get post by user
router.get("/user/:userId", getUserPosts);

export default router;
