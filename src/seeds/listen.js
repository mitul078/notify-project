import "dotenv/config"
import { io } from "socket.io-client"

const socket = io(`http://localhost:${process.env.PORT || 4000}`, { auth: { token: process.argv[2] } })

socket.on("connect", () => console.log("CONNECTED, WAITING FOR NOTIFICATIONS..."))
socket.on("connect_error", (err) => console.log("CONNECT ERROR:", err.message))
socket.on("notification", (n) => console.log("LIVE NOTIFICATION:", n))