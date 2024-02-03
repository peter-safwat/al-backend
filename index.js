const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const EventEmitter = require("events");
const app = require("./app");

const ioEmitter = new EventEmitter();

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 8000;
const server = createServer(app); // Use createServer directly for the HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Change this to your client's origin
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id); // Access the socket ID

  socket.on("chat message English (Default)", (message) => {
    console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message English (Default)", message);
  });
  
  socket.on("chat message Espain", (message) => {
    console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message English (Default)", message);
  });
  
  socket.on("chat message العربية", (message) => {
    console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message English (Default)", message);
  });
  
  socket.on("chat message Français", (message) => {
    console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message English (Default)", message);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
ioEmitter.emit("ioReady", io);

module.exports = { ioEmitter };
