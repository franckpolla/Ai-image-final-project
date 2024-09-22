//JWT is great for stateless authentication in APIs, scalable systems, or single-page applications (SPAs), and can be passed via HTTP headers.

import jwt from "jsonwebtoken";
//A cookie is a small piece of data sent from a server to a client and stored in the client’s browser.
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; //Retrieve the token from cookies
  if (!token) {
    return res.status(401).json({ message: "you are not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (req, data) => {
    if (err) {
      return res.status(403).json({ message: "token is not valid " });
    }
    req.userId = data._id;
    next(); //If token is valid, move to the next middleware or route
  });
};
