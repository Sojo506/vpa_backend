import jwt from "jsonwebtoken";
import Verinarian from "../models/Veterinarian.js";

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.veterinarian = await Verinarian.findById(decoded.id).select(
        "-password -token -confirmed"
      );

      return next();
    } catch (error) {
      return res.status(403).json({ success: false, code: "invalid_token" });
    }
  }

  if (!token)
    return res
      .status(403)
      .json({ success: false, code: "invalid_or_nonexistent_token" });

  next();
};

export { checkAuth };
