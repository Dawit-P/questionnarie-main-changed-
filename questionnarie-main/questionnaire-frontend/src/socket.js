import { io } from "socket.io-client";

const URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
export const socket = io(URL, {
  autoConnect: true,
});