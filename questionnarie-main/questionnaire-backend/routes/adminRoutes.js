import express from "express";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Admin-only route to create a questionnaire
router.post("/questionnaire", protect, authorize("admin"), async (req, res) => {
  try {
    // Add logic to create a questionnaire
    res.status(201).json({ success: true, data: "Questionnaire created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin-only route to view reports
router.get("/reports", protect, authorize("admin"), async (req, res) => {
  try {
    // Add logic to fetch reports
    res.status(200).json({ success: true, data: "Report data" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;