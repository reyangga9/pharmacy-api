import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Get secret from .env

export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Cek apakah role valid
    if (![1, 2].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use 1 for Manager, 2 for Admin." });
    }

    // Cek apakah username sudah digunakan
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: { username, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login & Generate JWT
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    console.log('test')

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
