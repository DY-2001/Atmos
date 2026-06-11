require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 4000;
const { connectDB } = require("./config/db");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const swaggerUI = require("swagger-ui-express");
var path = require("path");
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
const { apiDoc } = require("./utils/docs");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    // origin: "*",
  },
});
//  this is app

const meetingRooms = new Map();

const getMeetingParticipants = (roomCode) => {
  const room = meetingRooms.get(roomCode);
  if (!room) return [];

  return Array.from(room.values());
};

const removeMeetingParticipant = (socket) => {
  const { roomCode } = socket.data.meeting || {};
  if (!roomCode) return;

  const room = meetingRooms.get(roomCode);
  if (!room) return;

  room.delete(socket.id);
  socket.to(roomCode).emit("meeting:user-left", { socketId: socket.id });
  socket.leave(roomCode);

  if (room.size === 0) {
    meetingRooms.delete(roomCode);
  }

  socket.data.meeting = null;
};

// const corsOptions = {
//     credentials: true,            //access-control-allow-credentials:true
// }

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiDoc));
app.use(morgan("tiny", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connectDB();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    // origin: "*",
  })
); // Use this after the variable declaration

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})


app.use(limiter);

app.use("/user", require("./routes/user-routes"));
app.use("/project", require("./routes/project-routes"));
app.use("/section", require("./routes/section-routes"));
app.use("/task", require("./routes/task-routes"));
app.use("/note", require("./routes/note-routes"));
app.use("/chat", require("./routes/chat-routes"));
app.use("/meeting", require("./routes/meeting-routes"));
app.use("/admin", require("./routes/admin-routes"));
app.use("/message", require("./routes/message-routes"));
app.use("/agent", require("./routes/agent-routes"));

io.on("connection", (socket) => {
  console.log("New connection", socket.id);
  socket.on("join", ({ roomId, user }) => {
    socket.join(roomId);
  });

  socket.on("send-message", (message, channelId) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(channelId) || []);
    io.to(channelId).emit("receive-message", message);
  });

  socket.on("meeting:join", ({ roomCode, user }) => {
    if (!roomCode) return;

    removeMeetingParticipant(socket);

    if (!meetingRooms.has(roomCode)) {
      meetingRooms.set(roomCode, new Map());
    }

    const room = meetingRooms.get(roomCode);
    const participant = {
      socketId: socket.id,
      user: {
        _id: user?._id,
        userName: user?.userName || "Guest",
        avatar: user?.avatar || null,
      },
      // mediaState: {
      //   audio: false,
      //   video: false,
      // },
    };

    socket.join(roomCode);
    socket.data.meeting = { roomCode };
    socket.emit("meeting:participants", {
      participants: getMeetingParticipants(roomCode),
    });

    room.set(socket.id, participant);
    socket.to(roomCode).emit("meeting:user-joined", participant);
    console.log("meetingRooms after join", meetingRooms);
  });

  socket.on("meeting:offer", ({ to, offer }) => {
    const room = meetingRooms.get(socket.data.meeting?.roomCode);
    const fromParticipant = room?.get(socket.id);
    socket.to(to).emit("meeting:offer", {
      from: socket.id,
      fromUser: fromParticipant?.user,
      offer,
    });
  });

  socket.on("meeting:answer", ({ to, answer }) => {
    socket.to(to).emit("meeting:answer", { from: socket.id, answer });
  });

  socket.on("meeting:ice-candidate", ({ to, candidate }) => {
    socket.to(to).emit("meeting:ice-candidate", {
      from: socket.id,
      candidate,
    });
  });

  socket.on("meeting:media-state", ({ audio, video }) => {
    const { roomCode } = socket.data.meeting || {};
    if (!roomCode) return;

    const room = meetingRooms.get(roomCode);
    const participant = room?.get(socket.id);
    if (!participant) return;

    participant.mediaState = {
      audio: Boolean(audio),
      video: Boolean(video),
    };

    socket.to(roomCode).emit("meeting:media-state", {
      socketId: socket.id,
      mediaState: participant.mediaState,
    });
  });

  socket.on("meeting:leave", () => {
    removeMeetingParticipant(socket);
  });

  socket.on("disconnect", () => {
    removeMeetingParticipant(socket);
  });
});

// module.exports = app;
module.exports = server;

// app.get('/', (req, res) => {
//     res.send('ATMOS Backend Server');
// });

// To Do

// TASK
// Create Task - DONE
// Update Task - DONE
// Delete Task - DONE

// SECTION
// Create Section - DONE
// Update Section - DONE
// Delete Section - DONE

// PROJECT
// Create Project - DONE
// Update Project -
// Delete Project -

// USER
// Create User
// Update User
// Delete User
