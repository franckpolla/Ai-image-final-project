import axios from "axios";
import fs from "fs"; // it is used to create temporary files
import sharp from "sharp"; // it's a library use to manage images
import Post from "..//models/Post";
import User from "..//models/User";
import path from "path"; // it is used to create directory for files

const generateFileName = () => {};

const createPostWithImages_V2 = () => {};

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
  createPostWithImages_V2,
  generateFileName,
};
