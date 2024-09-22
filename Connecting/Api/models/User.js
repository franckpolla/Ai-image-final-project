const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // Regex for basic email validation
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    credit: {
      type: Number,
      default: 3,
    },

    // to ref is used to create the relation with the user array
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Post",
      },
    ],
  },

  { timestamps: true }
);

const User = mongoose.model("User", Userschema);

module.exports = User;
