import { Worker } from "bullmq";
import connection from "../config/connection.js";
import Notification from "../models/notification.model.js";
import { getEnabledChannels } from "../services/preference.service.js";
import { renderTemplate } from "../services/template.service.js";
import { emailQueue } from "../queues/email.queue.js";
import { emitter } from "../config/emitter.js";

const SUPPORTED_CHANNELS = ["in_app", "email"]

const eventWorker = new Worker(
    "notification-events",
    async (job) => {
        const { eventType, userId, phone, email, idempotencyKey, data = {} } = job.data

        const channels = (await getEnabledChannels(userId, eventType)).filter(c => SUPPORTED_CHANNELS.includes(c))
        console.log(`EVENT RECEIVED: ${eventType} / user ${userId} / channels: [${channels.join(", ")}]`)

        for (const channel of channels) {
            const rendered = await renderTemplate(eventType, channel, data)
            if (!rendered) {
                console.log(`NO TEMPLATE FOR ${eventType} / ${channel}, SKIPPING`)
                continue
            }

            try {

                const notification = await Notification.create({
                    userId,
                    channel,
                    eventType,
                    recipient: { email, phone },
                    payload: data,
                    subject: rendered.subject,
                    body: rendered.body,
                    idempotencyKey
                })

                if (channel === "email") {
                    await emailQueue.add("send-email", { notificationId: notification._id.toString() }, { jobId: notification._id.toString() })
                }

                if (channel === "in_app") {
                    emitter.to(`user:${userId}`).emit("notification", {
                        id: notification._id,
                        eventType,
                        body: notification.body,
                        createdAt: notification.createdAt
                    })

                    notification.status = "sent"
                    notification.sentAt = new Date()
                    await notification.save()
                }

                console.log(`NOTIFICATION CREATED: ${eventType} / ${channel} / ${userId}`)
            } catch (error) {
                if (error.code === 11000) {
                    console.log(`DUPLICATE SKIPPED: ${idempotencyKey} / ${channel}`)
                    continue
                }
                throw error

            }
        }
    },
    { connection, concurrency: 5 }
)

eventWorker.on("ready", () => console.log("EVENT WORKER READY"))
eventWorker.on("error", (err) => console.log("EVENT WORKER ERROR:", err.message))
eventWorker.on("failed", (job, err) => {
    console.log(`EVENT JOB ${job?.id} FAILED:`, err.message)
})