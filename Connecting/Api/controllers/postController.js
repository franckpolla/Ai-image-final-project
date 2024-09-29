import axios from "axios";
import fs from "fs"; // it is used to create temporary files
import sharp from "sharp"; // it's a library use to manage images
import Post from "..//models/Post.js";
import User from "..//models/User.js";
import path from "path"; // it is used to create directory for files

//this function will generate names of files
const generateFileName = (userId, allPostsLength) => {
  const date = new Date().toDateString().replace(/:/g, "-");
  const fileName = `${userId}_${allPostsLength + 1}_${date}.jpg`;
  return fileName;
};

const createPostWithImages_V3 = async (req, res, next) => {
  const { userId } = req.params;
  const { prompt, size, negativePrompt, style, imageURL, revisedPrompt } =
    req.body;
  const allPosts = await Post.find();
  const allPostsLength = allPosts.length;
  const fileName = generateFileName(userId, allPostsLength);
  //path.join(__dirname, "../..", "uploads", fileName): This line constructs the absolute path to a file located in the "uploads" directory, which is two levels above the current directory where the script is running.
  const filePath = path.join(__dirname, "../..", "uploads", fileName);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //An ArrayBuffer is a data type in JavaScript used to represent a fixed-length raw binary data buffer. It is part of the Web API and is particularly useful when you need to manipulate low-level binary data, such as reading files, working with streams, or handling network requests where data is in binary form (e.g., images, video, and audio).
    //The provided code snippet is making an HTTP request using the axios library, specifically for downloading an image (or any file) and handling a few custom settings
    const response = await axios({
      url: imageURL,
      responseType: "arraybuffer",
      maxRedirects: 5,
    });
    const imageBuffer = Buffer.from(response.data);
    //Sharp is a high-performance image processing library often used for tasks like resizing, formatting, and converting images.
    await sharp(imageBuffer).png().toFile(filePath); // here we convert the image into a png, and after convertion we send it to the filepath.

    // we are creating a new post
    const newPost = new Post({
      userId: userId,
      prompt: prompt,
      negativePrompt: negativePrompt,
      aimodal: "AI Image Art Dall-e-v3",
      aiMage: imageURL,
      size: size,
      quality: "HD",
      quantity: 1,
      style: style,
      revisedPrompt: revisedPrompt,
      images: fileName,
    });
    // we are saving the new post in the collection , that is because we are using the new method ,which is diff from await.Post.create()
    await newPost.save();
    user.posts.push(newPost);
    await user.save();
    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating post." });
  }
};

const getPostsController = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "username"); //The use of populate() simplifies querying and reduces the need to make multiple database calls. Instead of manually fetching the user data based on the ObjectId,
    res.status(201).json({ posts: posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getSinglePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const retunrPost = await Post.findById(postId).populate("user", "username");
    return res.status(200).json({ posts: retunrPost.posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const posts = await Post.find({ userId: userId }).populate(
      "user",
      "username"
    );
    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    await post.remove();
    res.status(204).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
const likePost = async (req, res, next) => {
  const { postId, userId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "Post already liked." });
    }
    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const dislikePost = async (req, res, next) => {
  const { postId, userId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found." });
    }
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((like) => like !== userId); // we are filtering by user id to remove the post from the list
      await post.save();
      return res.status(200).json({ message: "Post disliked successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export {
  getSinglePost,
  getUserPosts,
  likePost,
  deletePost,
  dislikePost,
  getPostsController,
  createPostWithImages_V3,
};
