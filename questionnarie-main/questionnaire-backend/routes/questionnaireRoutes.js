import express from "express";
import Questionnaire from "../models/Questionnaire.js";

const router = express.Router();

// GET route to fetch all questionnaires
router.get("/", async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find(); // Fetch data from MongoDB
    res.status(200).json(questionnaires);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;