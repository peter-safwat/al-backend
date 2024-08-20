// const express = require("express");
// const fs = require("fs");
// const path = require("path");

// const { exec } = require("child_process");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const EventEmitter = require("events");
// const apiRouter = require("./app");

// const ioEmitter = new EventEmitter();

// dotenv.config({ path: "./config.env" });

// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("DB connection successful!"));

// const port = process.env.PORT || 8000;
// const app = express();
// app.use("/api", apiRouter);

// const server = createServer(app); // Use createServer directly for the HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "https://ajfinal-git-master-petersafwat11.vercel.app",
//     ], // Change this to your client's origin
//     methods: ["GET", "POST"],
//   },
// });
// const bannedMembersFilePath = path.resolve("bannedMembers.json");
// const muteMembersFilePath = path.resolve("tempBan.json");
// const membersFilePath = path.resolve("activeMembers.json");

// let bannedMembers = [];
// let mutedMembers = [];
// let activeMembers = [];

// // Load Members from File
// const loadMembers = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         if (err.code === "ENOENT") return resolve([]); // File doesn't exist
//         return reject(err);
//       }
//       resolve(data ? JSON.parse(data) : []);
//     });
//   });
// };

// // Watch and Reload Files
// const watchFileChanges = (filePath, updateFn) => {
//   fs.watch(filePath, (eventType) => {
//     if (eventType === "change") {
//       loadMembers(filePath)
//         .then((data) => updateFn(data))
//         .catch((err) => console.error(`Error reloading ${filePath}:`, err));
//     }
//   });
// };

// // Initial Load
// Promise.all([
//   loadMembers(bannedMembersFilePath),
//   loadMembers(muteMembersFilePath),
//   loadMembers(membersFilePath),
// ])
//   .then(([banned, muted, members]) => {
//     bannedMembers = banned;
//     mutedMembers = muted;
//     activeMembers = members;

//     // Watch for changes
//     watchFileChanges(bannedMembersFilePath, (data) => (bannedMembers = data));
//     watchFileChanges(muteMembersFilePath, (data) => (mutedMembers = data));
//   })
//   .catch((err) => {
//     console.error("Error loading initial data:", err);
//   });

// // Function to Write Data to File
// const writeToFile = (filePath, data) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
//       if (err) return reject(err);
//       resolve();
//     });
//   });
// };

// io.on("connection", (socket) => {
//   const clientIP = socket.handshake.address;

//   const isBanned = bannedMembers.some((member) => member.ip === clientIP);
//   const isMuted = mutedMembers.some((member) => member.ip === clientIP);

//   if (isBanned || isMuted) {
//     socket.emit("banned", {
//       state: "connection",
//       message: isBanned ? "IP banned" : "IP muted to the end of the day",
//     });
//     socket.disconnect(true);
//     return;
//   }

//   socket.on("banned", ({ name, id, message }) => {
//     bannedMembers.push({ id, name, ip: clientIP });
//     writeToFile(bannedMembersFilePath, bannedMembers)
//       .then(() => {
//         socket.broadcast.emit("banned", {
//           state: "restricted by admin",
//           name: name,
//           id: id,
//           message: message,
//         });
//       })
//       .catch((err) => {
//         console.error("Error writing banned members:", err);
//       });
//   });

//   socket.on("register user", ({ name }) => {
//     activeMembers.push({ id: socket.id, ip: clientIP, name });
//     writeToFile(membersFilePath, activeMembers)
//       .then(() => {
//         socket.broadcast.emit("register user", activeMembers);
//       })
//       .catch((err) => {
//         console.error("Error writing active members:", err);
//       });
//   });

//   socket.on("chat message English (Default)", (message) => {
//     socket.broadcast.emit("chat message English (Default)", message);
//   });

//   socket.on("chat mode", (data) => {
//     socket.broadcast.emit("chat mode", data);
//   });

//   socket.on("chat poll", (data) => {
//     socket.broadcast.emit("chat poll", data);
//   });
//   socket.on("disconnect", () => {
//     activeMembers = activeMembers.filter((member) => member.id !== socket.id);
//     writeToFile(membersFilePath, activeMembers)
//       .then(() => {
//         socket.broadcast.emit("register user", activeMembers);
//       })
//       .catch((err) => {
//         console.error("Error writing active members:", err);
//       });
//   });
// });

// server.listen(port, () => {
//   console.log(`app running on port ${port}...`);
// });

// // process.on("unhandledRejection", (err) => {
// //   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
// //   console.log(err.name, err.message);
// //   const logMessage = `${new Date().toISOString()} - ${err.name}: ${
// //     err.message
// //   }\n`;
// //   fs.appendFile("error.log", logMessage, (writeError) => {
// //     if (writeError) {
// //       console.error("Failed to write to log file:", writeError);
// //     } else {
// //       console.log("Error logged to file.");
// //     }

// //     server.close(() => {
// //       // Restart the server
// //       exec("sh start", (restartError, stdout, stderr) => {
// //         if (restartError) {
// //           console.error("Failed to restart the server:", restartError);
// //           process.exit(1);
// //         } else {
// //           console.log("Server restarted.");
// //           console.log(`stdout: ${stdout}`);
// //           console.log(`stderr: ${stderr}`);
// //           process.exit(1);
// //         }
// //       });
// //     });
// //   });
// // });
// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// ioEmitter.emit("ioReady", io);

// module.exports = { ioEmitter };
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const next = require("next");
const apiRouter = require("./app");

dotenv.config({ path: "./config.env" });
const dev = process.env.NODE_ENV !== "production";
const nextAppDir = path.resolve(__dirname, "../../final project/next14-aj");
const nextApp = next({ dev, dir: nextAppDir });
const handle = nextApp.getRequestHandler();
const port = process.env.PORT || 8000;
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Start Next.js app before setting up the express routes
nextApp.prepare().then(() => {
  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

  // process.on("uncaughtException", (err) => {
  //   console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  //   console.log(err.name, err.message);

  //   // Log the error to a file
  //   const logMessage = `${new Date().toISOString()} - ${err.name}: ${
  //     err.message
  //   }\n`;
  //   fs.appendFile("error.log", logMessage, (writeError) => {
  //     if (writeError) {
  //       console.error("Failed to write to log file:", writeError);
  //     } else {
  //       console.log("Error logged to file.");
  //     }

  //     // Close the server (optional if you are just using process.exit directly)
  //     // server.close(() => {
  //     // Restart the server
  //     exec("sh start", (restartError, stdout, stderr) => {
  //       if (restartError) {
  //         console.error("Failed to restart the server:", restartError);
  //         process.exit(1);
  //       } else {
  //         console.log("Server restarted.");
  //         console.log(`stdout: ${stdout}`);
  //         console.log(`stderr: ${stderr}`);
  //         process.exit(1);
  //       }
  //     });
  //     // });
  //   });
  // });
  // Your mongoose connection code
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
    })
    .then(() => console.log("DB connection successful!"));

  const app = express();
  app.use("/api", apiRouter);
  // Pass Next.js routing to the default request handler
  app.all("*", (req, res) => handle(req, res));

  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://ajsportstv.ch",
        "https://www.ajsportstv.ch",
        "https://dashboard-14.vercel.app",
        "https://next14-aj.vercel.app",
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
    //    const clientIP = socket.handshake.address;
    // const clientIP = socket.request.connection.remoteAddress;
    var clientIP = socket.handshake.headers["x-real-ip"];

    const bannedMembers = readFromFile(bannedMembersFilePath);
    const MutedMembers = readFromFile(muteMembersFilePath);
    const isBanned = bannedMembers.some((member) => member.ip === clientIP);
    const isMuted = MutedMembers.some((member) => member.ip === clientIP);

    if (isBanned || isMuted) {
      socket.emit("banned", {
        state: "connection",
        message: isBanned ? "IP banned" : "IP muted to the end of the day",
      }); // Emit a custom event for providing the reason
      socket.disconnect(true); // Disconnect the socket forcefully
      return;
    }
    socket.on("banned", ({ name, id, message }) => {
      socket.broadcast.emit("banned", {
        state: "restricted by admin",
        name: name,
        id: id,
        message: message,
      });
    });

    socket.on("register user", ({ name }) => {
      const activeMembers = readFromFile(membersFilePath);
      activeMembers.push({ id: socket.id, ip: clientIP, name });
      writeToFile(activeMembers);
      socket.broadcast.emit("register user", activeMembers);
      console.log(activeMembers);
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
    console.log(`> Ready on http://localhost:${port}`);
  });

  // ... Your existing error handling code
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
});
