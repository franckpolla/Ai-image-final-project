const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    prompt: {
      type: String,
      // The trim: true option in a Mongoose schema field definition is used to automatically remove whitespace from the beginning and end of a string before it's saved to the database.
      trim: true,
    },
    negativePrompt: {
      type: String,
      // The trim: true option in a Mongoose schema field definition is used to automatically remove whitespace from the beginning and end of a string before it's saved to the database.

      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    quality: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      trim: true,
    },
    style: {
      type: Number,
      trim: true,
    },

    aimodal: {
      type: String,

      ref: "User",
    },
    aiMage: [
      {
        type: String,
        required: false,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      },
    ],
    // to ref is used to create the relation with the user array
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
