import User from "../models/User.js";

// in this function we are getting the user data from the database
const GetUserController = async (res, req) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...data } = user;
    res.status(200).json(data._doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// const UpdateUserController = async (res, req) => {
//   const { userId } = req.params;
//   const updates = req.body;
//   try {
//     const userToUpdate = await User.findById(userId);
//     if (!userToUpdate) {
//       return res.status(404).json({ error: error.message });
//     }

//     Object.assign(userToUpdate, updates); // merge the req.body fields into the updates object
//     await userToUpdate.save();
//     res
//       .status(200)
//       .json({ message: "User Updated successfully", user: userToUpdate });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

const UpdateUserController = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  const allowedUpdates = ["username", "email", "age"]; // Example allowed fields

  const isValidOperation = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid request to update" });
  }

  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }
    // we are passing the updates to the userToUpdate,
    Object.assign(userToUpdate, updates);
    await userToUpdate.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", user: userToUpdate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const BuyCredit = async (req, res) => {
  const { userId } = req.params; // Extract userId from URL parameters
  const updateData = req.body; // Extract update data from request body
  try {
    // Find the user by ID
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if "credit" field is present in the request body
    if (updateData.hasOwnProperty("credit")) {
      userToUpdate.credit = updateData.credit; // Update the credit field
      await userToUpdate.save(); // Save the user

      return res
        .status(200)
        .json({ message: "Credit Updated successfully", user: userToUpdate });
    } else {
      // Handle case where "credit" is not provided in the update data
      return res
        .status(400)
        .json({ error: "Credit field is missing in the request" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export { GetUserController, UpdateUserController, BuyCredit };
