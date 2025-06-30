import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("user:register", (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                break;
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

mongoose
    .connect(config.database.url, config.database.options)
    .then(() => {
        console.log("Connected to MongoDB");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`CORS enabled for: ${process.env.ALLOWED_ORIGINS}`);
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

export { io, userSockets };
