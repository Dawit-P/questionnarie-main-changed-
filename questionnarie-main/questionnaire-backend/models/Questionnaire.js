const mongoose = require("mongoose");

// const questionnaireSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
const questionnaireSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }] // Add this line
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);