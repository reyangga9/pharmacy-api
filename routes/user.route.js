import express from "express";
import { createUser, loginUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/register", createUser); // Register a new user
router.post("/login", loginUser); // Login user and get JWT

export default router;
