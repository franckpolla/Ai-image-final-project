import express from "express";
import {
  register,
  logIn,
  logOut,
  refetch,
} from "../controllers/authController.js";

// WE are using router instance to define the different route.
const router = express.Router();
// POST request for user registration
router.post("/register", register);
// Log in user
router.post("/login", logIn);
// Log out user
router.post("/logout", logOut);
// Fetch current userS

router.get("/refetch", refetch);

export default router;
