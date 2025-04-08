// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Register a new user
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, role } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await User.create({ username, email, password, role });
      const token = user.generateAuthToken();
      const userData = user.toObject();
      delete userData.password;
      res.status(201).json({ message: "User registered successfully", user: userData, token });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
);

// Login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = user.generateAuthToken();
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).json({ message: "Login successful", token, user: userWithoutPassword });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }
);

// Get current user profile
router.get("/profile", protect, async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

module.exports = router;
