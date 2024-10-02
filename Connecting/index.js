import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import next from "next"; // we are importing next.js
import authRoute from "../Connecting/Api/routes/auth.js";
import postRoute from "../Connecting/Api/routes/posts.js";
import userRoute from "../Connecting/Api/routes/users.js";
import path from "path";
import verifyToken from "../Connecting/Api/middlewares/verifyToken.js";
import { fileURLToPath } from "url";
// C:\Users\PC\Desktop\AI-Image final project\Connecting\config.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config.env" });

// we are establishing a custom server with next.js in express
const dev = process.env.NODE_ENV !== "production";

const nextServer = next({ dev }); //Initializes the Next.js Application: This line creates an instance of the Next.js application by invoking the next function provided by the Next.js framework.

const handle = nextServer.getRequestHandler(); //Retrieves the Default Request Handler: This line obtains a handler function from the Next.js app instance that can process all incoming HTTP requests that are not explicitly handled by your custom server
const app = express();

// Initializes the connection

const port = process.env.PORT || 3001;
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

connectToMongoDB();
// app.use app.use: This method is used to mount middleware functions in an Express application.
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //static files. This line sets up middleware to deliver files from a specified directory (uploads) when a client makes requests to a particular route (/uploads)

//It connects a specific set of routes (defined in authRoute) to a base path (/api/auth) within your application. This setup is essential for organizing your application's endpoints, especially as it grows in complexity.
app.use("/api/auth", authRoute);
app.use("/api/auth", postRoute);
app.use("/api/auth", verifyToken, userRoute); // here we have a middleware to verify the token

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
});
//nextServer.prepare() initializes the Next.js server. This method returns a Promise.
//Sets up Express to defer all GET requests to Next.js
//Starts the Express server
//Logs a message when the server successfully starts
nextServer.prepare().then(() => {
  app.get("*", (req, res) => {
    return handle(req, res);
  });
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // logs the server's listening status
  });
});
