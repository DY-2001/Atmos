require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 4000;
const { connectDB } = require("./config/db");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
var path = require("path");
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
const { apiDoc } = require("./utils/docs");
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//  this is app

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
    origin: "http://localhost:3000",
  })
); // Use this after the variable declaration

app.use("/user", require("./routes/user-routes"));
app.use("/project", require("./routes/project-routes"));
app.use("/section", require("./routes/section-routes"));
app.use("/task", require("./routes/task-routes"));
app.use("/note", require("./routes/note-routes"));
app.use("/chat", require("./routes/chat-routes"));
app.use("/admin", require("./routes/admin-routes"));
app.use("/message", require("./routes/message-routes"));

const socketUserMap = {};

io.on("connection", (socket) => {
  console.log("New connection", socket.id);
  //   socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
  //     socketUserMap[socket.id] = user;
  //     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  //     clients.forEach((clientId) => {
  //       io.to(clientId).emit(ACTIONS.ADD_PEER, {
  //         peerId: socket.id,
  //         createOffer: false,
  //         user,
  //       });
  //       socket.emit(ACTIONS.ADD_PEER, {
  //         peerId: clientId,
  //         createOffer: true,
  //         user: socketUserMap[clientId],
  //       });
  //     });
  //     socket.join(roomId);
  //   });

  //   const leaveRoom = () => {
  //     const { rooms } = socket;
  //     Array.from(rooms).forEach((roomId) => {
  //       const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
  //       clients.forEach((clientId) => {
  //         io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
  //           peerId: socket.id,
  //           userId: socketUserMap[socket.id]?.id,
  //         });

  //         // socket.emit(ACTIONS.REMOVE_PEER, {
  //         //     peerId: clientId,
  //         //     userId: socketUserMap[clientId]?.id,
  //         // });
  //       });
  //       socket.leave(roomId);
  //     });
  //     delete socketUserMap[socket.id];
  //   };
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
