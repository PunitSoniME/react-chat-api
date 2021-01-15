const port = process.env.PORT || 5001;
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");

    //  res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
});

io.on("connection", (socket) => {

    socket.on("add-user", (username) => {
        io.emit("on-user-add", {
            username: null, message: `${username} has joined this chat`, type: "new-user"
        })
    });

    socket.on("send-message", ({ username, message }) => {
        io.emit("on-receive-message", { username: username, message: message, type: "message" });
    });

    socket.on("logout", (username) => {
        if (username) {
            io.emit("on-logout", { username: null, message: `${username} has left chat`, type: "user-left" });
        }
    });

    socket.on("disconnect", () => {

    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));