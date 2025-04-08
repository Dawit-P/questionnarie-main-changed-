// routes/answerRoutes.js
// After saving newAnswer inside your POST route:
await newAnswer.save();

// Emit the new answer event using Socket.IO:
const io = req.app.get("socketio"); // if you set it as an app variable
io.emit("updateAnswers", newAnswer);

res.status(201).json(newAnswer);
