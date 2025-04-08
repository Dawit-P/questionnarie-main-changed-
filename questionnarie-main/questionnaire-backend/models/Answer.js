// const mongoose = require("mongoose");

// const answerSchema = new mongoose.Schema({
//   questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
//   userId: { type: String, required: true }, // Assuming you have a user authentication system
//   answerText: { type: String, required: true },
//   answeredAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Answer", answerSchema);
// const mongoose = require("mongoose");

// const answerSchema = new mongoose.Schema({
//   questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
//   userId: { type: String, required: true }, // Assuming you have a user authentication system
//   answerText: { type: [String], required: true }, // Array of strings to support multiple answers
//   otherAnswerText: { type: String }, // Additional text for the "Other" option
//   answeredAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Answer", answerSchema);
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Question", 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  }, // Assuming you have a user authentication system
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Organization", 
    required: true 
  }, // Reference to the Organization model
  answerText: { 
    type: [String], 
    required: true 
  }, // Array of strings to support multiple answers
  otherAnswerText: { 
    type: String 
  }, // Additional text for the "Other" option
  answeredAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Answer", answerSchema);