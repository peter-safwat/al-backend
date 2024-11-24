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

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );
const DB =
  "mongodb+srv://petersafwat:2ZAlnpsobhG87VV0@cluster0.dsafm2w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
      "https://next14-aj.vercel.app",
      "https://dashboard-14.vercel.app",
    ], // Change this to your client's origin
    methods: ["GET", "POST"],
  },
});
const bannedMembersFilePath = path.resolve("bannedMembers.json");
const muteMembersFilePath = path.resolve("tempBan.json");
const membersFilePath = path.resolve("activeMembers.json");

let bannedMembers = [];
let mutedMembers = [];
let activeMembers = [];

// Load Members from File
const loadMembers = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") return resolve([]); // File doesn't exist
        return reject(err);
      }
      resolve(data ? JSON.parse(data) : []);
    });
  });
};

// Watch and Reload Files
const watchFileChanges = (filePath, updateFn) => {
  fs.watch(filePath, (eventType) => {
    if (eventType === "change") {
      loadMembers(filePath)
        .then((data) => updateFn(data))
        .catch((err) => console.error(`Error reloading ${filePath}:`, err));
    }
  });
};

// Initial Load
Promise.all([
  loadMembers(bannedMembersFilePath),
  loadMembers(muteMembersFilePath),
  loadMembers(membersFilePath),
])
  .then(([banned, muted, members]) => {
    bannedMembers = banned;
    mutedMembers = muted;
    activeMembers = members;

    // Watch for changes
    watchFileChanges(bannedMembersFilePath, (data) => (bannedMembers = data));
    watchFileChanges(muteMembersFilePath, (data) => (mutedMembers = data));
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

// Function to Write Data to File
const writeToFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

io.on("connection", (socket) => {
  const clientIP = socket.handshake.address;

  const isBanned = bannedMembers.some((member) => member.ip === clientIP);
  const isMuted = mutedMembers.some((member) => member.ip === clientIP);

  if (isBanned || isMuted) {
    socket.emit("banned", {
      state: "connection",
      message: isBanned ? "IP banned" : "IP muted to the end of the day",
    });
    socket.disconnect(true);
    return;
  }

  socket.on("banned", ({ name, id, message }) => {
    bannedMembers.push({ id, name, ip: clientIP });
    writeToFile(bannedMembersFilePath, bannedMembers)
      .then(() => {
        socket.broadcast.emit("banned", {
          state: "restricted by admin",
          name: name,
          id: id,
          message: message,
        });
      })
      .catch((err) => {
        console.error("Error writing banned members:", err);
      });
  });

  socket.on("register user", ({ name }) => {
    activeMembers.push({ id: socket.id, ip: clientIP, name });
    writeToFile(membersFilePath, activeMembers)
      .then(() => {
        socket.broadcast.emit("register user", activeMembers);
      })
      .catch((err) => {
        console.error("Error writing active members:", err);
      });
  });

  socket.on("chat message English (Default)", (message) => {
    socket.broadcast.emit("chat message English (Default)", message);
  });

  socket.on("chat mode", (data) => {
    socket.broadcast.emit("chat mode", data);
  });

  socket.on("chat poll", (data) => {
    socket.broadcast.emit("chat poll", data);
  });
  socket.on("disconnect", () => {
    activeMembers = activeMembers.filter((member) => member.id !== socket.id);
    writeToFile(membersFilePath, activeMembers)
      .then(() => {
        socket.broadcast.emit("register user", activeMembers);
      })
      .catch((err) => {
        console.error("Error writing active members:", err);
      });
  });
});

server.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
