import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken"
import connection from "./config/connection.js";

export function initSocket(httpServer) {
    const io = new Server(httpServer, { cors: { origin: "*" } })
    io.adapter(createAdapter(connection.duplicate(), connection.duplicate()))

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) return next(new Error("NO TOKEN"))

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.userId = String(decoded.id)
            next()

        } catch (error) {
            next(new Error("INVALID TOKEN"))

        }
    })

    io.on("connection", (socket) => {
        socket.join(`user:${socket.userId}`)
        console.log("SOCKET CONNECTED")
        socket.on("disconnect", () => console.log("SOCKET DISCONNECTED"))
    })

    return io

}