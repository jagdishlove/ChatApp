const express = require("express");
const cors = require("cors");
const http = require("http").createServer(app);
const app = express();
const { Server } = require("socket.io").istern(server);
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "window.location.hostname",
        method: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`user connected : ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user with ID:${socket.id} user joined room : ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});
