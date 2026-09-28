import "dotenv/config"
import mongoose from "mongoose"
import connectDB from "../config/db.js"
import NotificationTemplate from "../models/template.model.js"

const templates = [
    {
        eventType: "resume.scored",
        channel: "email",
        subject: "Your application for {{jobTitle}} has been scored",
        body: "<p>Hi {{candidateName}},</p><p>Your resume for <b>{{jobTitle}}</b> scored <b>{{score}}/100</b>.</p>",
    },
    {
        eventType: "resume.scored",
        channel: "in_app",
        body: "Your resume for {{jobTitle}} scored {{score}}/100.",
    },
    {
        eventType: "application.failed",
        channel: "email",
        subject: "We couldn't process your application for {{jobTitle}}",
        body: "<p>Hi {{candidateName}},</p><p>Something went wrong processing your resume for <b>{{jobTitle}}</b>. Please try applying again.</p>",
    },
    {
        eventType: "application.failed",
        channel: "in_app",
        body: "We couldn't process your application for {{jobTitle}}. Please try again.",
    },
]

await connectDB()

await NotificationTemplate.bulkWrite(
    templates.map((t) => ({
        updateOne: {
            filter: { eventType: t.eventType, channel: t.channel },
            update: { $set: t },
            upsert: true,
        },
    }))
)

console.log(`SEEDED ${templates.length} TEMPLATES`)
await mongoose.disconnect()