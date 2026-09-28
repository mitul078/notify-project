import "dotenv/config"
import connectDB from "./src/config/db.js"

await connectDB()

await import("./src/workers/event.worker.js")
await import("./src/workers/email.worker.js")