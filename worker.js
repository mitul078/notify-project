import "dotenv/config"
import connectDB from "./src/config/db.js"

await connectDB()

await import("./src/workers/event.worker.js")