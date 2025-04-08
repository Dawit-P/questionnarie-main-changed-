// ExampleComponent.jsx
import React, { useEffect } from "react";
import { io } from "socket.io-client";

const ExampleComponent = () => {
  useEffect(() => {
    // Create the socket connection
    const socket = io("http://localhost:5000", {
      auth: {
        token: "your JWT token here" // Replace with a valid token
      }
    });

    // Listen for connection
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Listen for real-time updates (e.g., updated answers)
    socket.on("updateAnswers", (data) => {
      console.log("Received updated answers:", data);
      // Here you might update component state to re-render the UI with the new data
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Data Example</h1>
      <p>Open your console to see connection and update events.</p>
    </div>
  );
};

export default ExampleComponent;
