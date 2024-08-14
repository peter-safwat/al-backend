const express = require("express");
const fs = require("fs");
const path = require("path");

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
const membersFilePath = path.join(__dirname, "activeMembers.json");
const bannedMembersFilePath = path.join(__dirname, "bannedMembers.json");
const muteMembersFilePath = path.join(__dirname, "tempBan.json");

const readFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf8");
  return data ? JSON.parse(data) : [];
};
const writeToFile = (data) => {
  fs.writeFileSync(membersFilePath, JSON.stringify(data, null, 2), "utf8");
};

io.on("connection", (socket) => {
  const clientIP = socket.handshake.address;
  const bannedMembers = readFromFile(bannedMembersFilePath);
  const MutedMembers = readFromFile(muteMembersFilePath);
  const isBanned = bannedMembers.some((member) => member.ip === clientIP);
  const isMuted = MutedMembers.some((member) => member.ip === clientIP);

  if (isBanned || isMuted) {
    socket.emit("banned", {
      message: isBanned ? "IP banned" : "IP muted to the end of the day",
    }); // Emit a custom event for providing the reason
    socket.disconnect(true); // Disconnect the socket forcefully
    return;
  }

  socket.on("register user", ({ name }) => {
    const activeMembers = readFromFile(membersFilePath);
    activeMembers.push({ id: socket.id, ip: clientIP, name });
    writeToFile(activeMembers);
    socket.broadcast.emit("register user", activeMembers);
  });
  console.log(socket.io); // Access the socket ID
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

  socket.on("disconnect", () => {
    const activeMembers = readFromFile(membersFilePath);

    // Remove the user
    const updatedMembers = activeMembers.filter(
      (member) => member.id !== socket.id
    );
    socket.broadcast.emit("register user", updatedMembers);

    writeToFile(updatedMembers);
  });
});

server.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   const logMessage = `${new Date().toISOString()} - ${err.name}: ${
//     err.message
//   }\n`;
//   fs.appendFile("error.log", logMessage, (writeError) => {
//     if (writeError) {
//       console.error("Failed to write to log file:", writeError);
//     } else {
//       console.log("Error logged to file.");
//     }

//     server.close(() => {
//       // Restart the server
//       exec("sh start", (restartError, stdout, stderr) => {
//         if (restartError) {
//           console.error("Failed to restart the server:", restartError);
//           process.exit(1);
//         } else {
//           console.log("Server restarted.");
//           console.log(`stdout: ${stdout}`);
//           console.log(`stderr: ${stderr}`);
//           process.exit(1);
//         }
//       });
//     });
//   });
// });
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

ioEmitter.emit("ioReady", io);

module.exports = { ioEmitter };
