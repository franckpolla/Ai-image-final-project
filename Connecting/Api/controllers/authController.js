import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10);
    // hashed password
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json({ user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // we compare the password that th user enter to the one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // we generate a token for the cookie
    const { ...data } = user._doc; // provides the plain data of the user document from mongodb, making it easier to manipulate and return.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.cookie("token", token).status(200).json(data); //Sets a Cookie: It attaches a cookie named "token" with the value of the token variable to the HTTP response.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const logOut = async (req, res, next) => {
  try {
    // This method is used to remove a cookie from the client’s browser
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// this functin is used to refresh every time the page is reloaded
const refetch = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized." });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user: user }); // providing the plain data of the user document from mongodb, making it easier to manipulate and return.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, logIn, logOut, refetch };
