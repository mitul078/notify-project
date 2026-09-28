import { Worker } from "bullmq";
import connection from "../config/connection.js";
import transporter from "../config/mailer.js";
import Notification from "../models/notification.model.js";

const emailWorker = new Worker(
    "notification-email",
    async (job) => {
        const notification = await Notification.findById(job.data.notificationId)
        if (!notification) throw new Error("NOTIFICATION NOT FOUND")

        if (notification.status === "sent") {
            console.log(`ALREADY SENT, SKIPPING: ${notification._id}`)
            return
        }

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: notification.recipient.email,
            subject: notification.subject,
            html: notification.body
        })

        notification.status = "sent"
        notification.sentAt = new Date()
        await notification.save()

        console.log(`EMAIL SENT: ${notification._id} -> ${notification.recipient.email}`)
    }, { connection, concurrency: 5 }
)

emailWorker.on("failed", async (job, err) => {
    console.log(`EMAIL JOB ${job?.id} FAILED (attempt ${job?.attemptsMade}):`, err.message)

    if (job && job.attemptsMade >= job.opts.attempts) {
        await Notification.findByIdAndUpdate(job.data.notificationId, {
            status: "failed",
            failureReason: err.message,
        })
    }
})

emailWorker.on("ready", () => console.log("EMAIL WORKER READY"))

export default emailWorker