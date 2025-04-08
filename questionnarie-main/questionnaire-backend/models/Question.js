// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   questionnaireId: { type: mongoose.Schema.Types.ObjectId, ref: "Questionnaire", required: true },
//   questionText: { type: String, required: true },
//   questionType: { type: String, required: true }, // e.g., "MultipleChoice", "Text"
// });

// module.exports = mongoose.model("Question", questionSchema); // Correct export
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionnaireId: { type: mongoose.Schema.Types.ObjectId, ref: "Questionnaire", required: true },
  questionText: { type: String, required: true },
  questionType: { type: String, required: true }, // e.g., "MultipleChoice", "Text"
  choices: [{ type: String }], // Array of choices for multiple-choice questions
  allowMultipleAnswers: { type: Boolean, default: false }, // Whether multiple answers are allowed
  otherOption: {
    enabled: { type: Boolean, default: false }, // Whether the "Other" option is enabled
    description: { type: String, default: "" }, // Description for the "Other" option
  },
});

module.exports = mongoose.model("Question", questionSchema);