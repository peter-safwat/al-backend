const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const EventEmitter = require("events");
const apiRouter = require("./app");

const ioEmitter = new EventEmitter();

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  // Log the error to a file
  const logMessage = `${new Date().toISOString()} - ${err.name}: ${
    err.message
  }\n`;
  fs.appendFile("error.log", logMessage, (writeError) => {
    if (writeError) {
      console.error("Failed to write to log file:", writeError);
    } else {
      console.log("Error logged to file.");
    }

    // Close the server (optional if you are just using process.exit directly)
    // server.close(() => {
    // Restart the server
    exec("sh start", (restartError, stdout, stderr) => {
      if (restartError) {
        console.error("Failed to restart the server:", restartError);
        process.exit(1);
      } else {
        console.log("Server restarted.");
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        process.exit(1);
      }
    });
    // });
  });
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
const app = express();
app.use("/api", apiRouter);

const server = createServer(app); // Use createServer directly for the HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ajfinal-git-master-petersafwat11.vercel.app",
    ], // Change this to your client's origin
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  // console.log("a user connected");
  console.log(socket.id); // Access the socket ID
  socket.emit("test", "testing message");
  socket.on("chat message English (Default)", (message) => {
    // console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message English (Default)", message);
  });

  socket.on("chat message Espain", (message) => {
    // console.log(
    //   "Received event from frontend:",
    //   message.message.startsWith("https")
    // );
    const mesgRevieved = message;
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message Espain", mesgRevieved);
  });

  socket.on("chat message العربية", (message) => {
    // console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message العربية", message);
  });

  socket.on("chat message Français", (message) => {
    // console.log("Received event from frontend:", message);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat message Français", message);
  });
  socket.on("chat mode", (data) => {
    // console.log("chat mode updated:", data);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat mode", data);
  });
  socket.on("chat poll", (data) => {
    // console.log("chat poll added:", data);
    // Broadcast the event to all other clients except the sender
    socket.broadcast.emit("chat poll", data);
  });

  // socket.on("disconnect", () => {
  //   console.log("user disconnected");
  // });
});

server.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  const logMessage = `${new Date().toISOString()} - ${err.name}: ${
    err.message
  }\n`;
  fs.appendFile("error.log", logMessage, (writeError) => {
    if (writeError) {
      console.error("Failed to write to log file:", writeError);
    } else {
      console.log("Error logged to file.");
    }

    server.close(() => {
      // Restart the server
      exec("sh start", (restartError, stdout, stderr) => {
        if (restartError) {
          console.error("Failed to restart the server:", restartError);
          process.exit(1);
        } else {
          console.log("Server restarted.");
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          process.exit(1);
        }
      });
    });
  });
});
ioEmitter.emit("ioReady", io);

module.exports = { ioEmitter };
