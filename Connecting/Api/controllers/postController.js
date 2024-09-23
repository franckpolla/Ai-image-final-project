import axios from "axios";
import fs from "fs"; // it is used to create temporary files
import sharp from "sharp"; // it's a library use to manage images
import Post from "..//models/Post";
import User from "..//models/User";
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
    await newPost.save();
    user.posts.push(newPost);
    await user.save();
    res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating post." });
  }
};

const getPostsController = async (req, res, next) => {};

const getSinglePost = async (req, res, next) => {};

const getUserPost = async (req, res, next) => {};
const deletePost = async (req, res, next) => {};
const likePost = async (req, res, next) => {};
const dislikePost = async (req, res, next) => {};

export {
  getSinglePost,
  getUserPost,
  likePost,
  deletePost,
  dislikePost,
  getPostsController,
  createPostWithImages_V3,
  generateFileName,
};
