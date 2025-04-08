// routes/questionnaireRoutes.js
const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Questionnaire = require("../models/Questionnaire");
const { protect, authorize } = require("../middleware/auth");

// Create a new questionnaire (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description } = req.body;
    try {
      const questionnaire = new Questionnaire({ title, description });
      const savedQuestionnaire = await questionnaire.save();
      res.status(201).json(savedQuestionnaire);
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Get all questionnaires
router.get("/", async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.status(200).json(questionnaires);
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single questionnaire by ID
router.get(
  "/:questionnaireId",
  [
    param("questionnaireId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid questionnaire ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    const { questionnaireId } = req.params;
    try {
      const questionnaire = await Questionnaire.findById(questionnaireId);
      if (!questionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }
      res.status(200).json(questionnaire);
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
