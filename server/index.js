const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://perpall.netfliy.app",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("User joined room:", data);
    socket.join(data.room);
    io.to(data.room).emit("user_joined", { user: data.username, room: data.room });
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
      
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
