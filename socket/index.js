import { Server } from "socket.io";

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userData, socketId) => {
  console.log("userAdded", userData, socketId);
  !users.some((user) => user.email === userData.email) &&
    users.push({ ...userData, socketId });
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
  });
});
