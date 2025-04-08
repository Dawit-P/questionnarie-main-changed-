// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config();

const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const userRoutes = require("./routes/userRoutes");
const questionnaireRoutes = require("./routes/questionnaireRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

const app = express();

// HTTP server & Socket.IO setup
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) =>
    console.error("Error connecting to MongoDB:", err)
  );

// Setup your routes
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questionnaires", questionnaireRoutes);
app.use("/api/organizations", organizationRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Socket.IO authentication middleware (optional)
// If you want to require JWT for socket connections:
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // attach decoded user info to socket
    next();
  } catch (err) {
    console.error("Socket JWT error:", err);
    next(new Error("Authentication error"));
  }
});

// Listen for Socket.IO connections
io.on("connection", (socket) => {
  console.log("A client connected", socket.id);

  // Example event: broadcast a message when a new answer is submitted
  socket.on("newAnswer", (data) => {
    // Broadcast to all connected clients (except sender)
    socket.broadcast.emit("updateAnswers", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Start the server using the HTTP server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
