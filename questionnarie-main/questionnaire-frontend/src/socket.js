// src/socket.js
import { io } from 'socket.io-client';

// Replace with your server URL if different
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false, // Prevents automatic connection
});
