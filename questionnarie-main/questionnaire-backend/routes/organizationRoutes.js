// routes/organizationRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Organization = require("../models/organization");
const { protect } = require("../middleware/auth");

// Register a new organization (protected route; adjust authorization as needed)
router.post(
  "/register",
  protect,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description } = req.body;
    try {
      const existingOrganization = await Organization.findOne({ name });
      if (existingOrganization) {
        return res.status(400).json({ message: "Organization already exists" });
      }
      const newOrganization = new Organization({ name, description });
      await newOrganization.save();
      res.status(201).json({ message: "Organization registered successfully", organization: newOrganization });
    } catch (error) {
      console.error("Error registering organization:", error);
      res.status(500).json({ message: "Failed to register organization" });
    }
  }
);

// Fetch all organizations
router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Failed to fetch organizations" });
  }
});

// Fetch a specific organization by ID
router.get(
  "/:organizationId",
  [
    param("organizationId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid organization ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { organizationId } = req.params;
    try {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.status(200).json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  }
);

module.exports = router;
