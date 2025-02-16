import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

export const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization"); // Expect only the JWT token
  
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
  
};
