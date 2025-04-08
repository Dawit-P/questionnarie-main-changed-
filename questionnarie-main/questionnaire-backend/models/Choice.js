const mongoose = require("mongoose");

const choiceSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  choiceText: { type: String, required: true },
});

module.exports = mongoose.model("Choice", choiceSchema);