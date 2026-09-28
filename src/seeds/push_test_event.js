import "dotenv/config"
import { eventQueue } from "../queues/event.queue.js"

await eventQueue.add("resume.scored", {
    eventType: "resume.scored",
    userId: "user-123",
    email: "mituljodhani078@gmail.com",
    idempotencyKey: "resume.scored-app-001",
    data: { candidateName: "Mitul", jobTitle: "Backend Engineer", score: 88 },
})

console.log("TEST EVENT PUSHED")
process.exit(0)