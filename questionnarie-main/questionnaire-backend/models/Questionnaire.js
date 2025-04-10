import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // Reference to questions
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

export default Questionnaire;