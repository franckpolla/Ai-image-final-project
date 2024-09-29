import express from "express";
import {
  GetUserController,
  UpdateUserController,
  BuyCredit,
} from "../controllers/userController.js";

const route = express.Router();

// get user information and post

route.get("/:userId", GetUserController);

// update user information
//PUT is used to replace an entire resource, meaning you send the full updated object.
//PATCH is used to partially update a resource, meaning you only send the fields that need to be updated.
route.put("/upade/:userId", UpdateUserController);

// buy credit
route.put("/credit/:userId", BuyCredit);

export default route;
