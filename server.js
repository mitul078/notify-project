import "dotenv/config"
import http from "http"
import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import { initSocket } from "./src/socket.js"

connectDB()

const server = http.createServer(app)
initSocket(server)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log("SERVER RUNNING")
})