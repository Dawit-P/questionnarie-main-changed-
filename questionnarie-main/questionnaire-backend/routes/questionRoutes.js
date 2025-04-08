// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, param, validationResult } = require("express-validator");

const Questionnaire = require("../models/Questionnaire");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const { protect, authorize } = require("../middleware/auth");

// Create a new questionnaire with questions (admin only)
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("questions").isArray().withMessage("Questions must be an array"),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, questions } = req.body;
    try {
      const newQuestionnaire = new Questionnaire({ title, description });
      const savedQuestionnaire = await newQuestionnaire.save();

      // Create each question with optional choices and settings
      for (const question of questions) {
        const newQuestion = new Question({
          questionnaireId: savedQuestionnaire._id,
          questionText: question.questionText,
          questionType: question.questionType,
          choices: question.choices || [],
          allowMultipleAnswers: question.allowMultipleAnswers || false,
          otherOption: question.otherOption || { enabled: false, description: "" },
          isRequired: question.isRequired || false,
        });
        await newQuestion.save();
      }
      res.status(201).json(savedQuestionnaire);
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res.status(500).json({ message: "Error creating questionnaire" });
    }
  }
);

// Update a question (admin only)
// This unified endpoint replaces duplicate update routes.
router.put(
  "/:questionId",
  protect,
  authorize("admin"),
  [
    param("questionId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid question ID"),
    body("questionText").notEmpty().withMessage("Question text is required"),
    body("questionType").notEmpty().withMessage("Question type is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { questionId } = req.params;
    const { questionText, questionType, choices, allowMultipleAnswers, otherOption, isRequired } = req.body;
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { questionText, questionType, choices, allowMultipleAnswers, otherOption, isRequired },
        { new: true }
      );
      if (!updatedQuestion) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ success: false, message: "Error updating question" });
    }
  }
);

// Fetch all questionnaires
router.get("/", async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.status(200).json(questionnaires);
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    res.status(500).json({ message: "Error fetching questionnaires" });
  }
});

// Add a question to an existing questionnaire (admin only)
router.post(
  "/:questionnaireId/questions",
  protect,
  authorize("admin"),
  [
    param("questionnaireId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid questionnaire ID"),
    body("questionText").notEmpty().withMessage("Question text is required"),
    body("questionType").notEmpty().withMessage("Question type is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const questionnaire = await Questionnaire.findById(req.params.questionnaireId);
      if (!questionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }
      const newQuestion = new Question({
        questionnaireId: questionnaire._id,
        questionText: req.body.questionText,
        questionType: req.body.questionType,
        choices: req.body.choices || [],
        allowMultipleAnswers: req.body.allowMultipleAnswers || false,
        otherOption: req.body.otherOption || { enabled: false, description: "" },
        isRequired: req.body.isRequired || false,
      });
      const savedQuestion = await newQuestion.save();
      res.status(201).json(savedQuestion);
    } catch (error) {
      console.error("Error adding question:", error);
      res.status(500).json({ message: "Error adding question" });
    }
  }
);

// Fetch a single questionnaire by ID
router.get("/:questionnaireId", async (req, res) => {
  const { questionnaireId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: "Invalid questionnaire ID" });
    }
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }
    res.status(200).json(questionnaire);
  } catch (error) {
    console.error("Error fetching questionnaire:", error);
    res.status(500).json({ message: "Error fetching questionnaire" });
  }
});

// Fetch questions for a specific questionnaire
router.get("/:questionnaireId/questions", async (req, res) => {
  const { questionnaireId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: "Invalid questionnaire ID" });
    }
    const questions = await Question.find({ questionnaireId });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Fetch a single question by ID
router.get("/questions/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Error fetching question" });
  }
});

// Fetch questions along with answers for a questionnaire filtered by organization (optional)
router.get("/:questionnaireId/questions-answers", async (req, res) => {
  const { questionnaireId } = req.params;
  const { organizationId } = req.query;
  try {
    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: "Invalid questionnaire ID" });
    }
    const questions = await Question.find({ questionnaireId });
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await Answer.find({ questionId: question._id, organizationId });
        return { ...question.toObject(), answers };
      })
    );
    res.status(200).json(questionsWithAnswers);
  } catch (error) {
    console.error("Error fetching questions and answers:", error);
    res.status(500).json({ message: "Error fetching questions and answers" });
  }
});

module.exports = router;
