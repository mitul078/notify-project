import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    recipient: { email: String, phone: String },
    eventType: { type: String, required: true },
    channel: { type: String, enum: ["in_app", "email", "sms"], required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    subject: String,
    body: String,
    status: { type: String, enum: ["pending", "sent", "delivered", "failed"], default: "pending" },
    idempotencyKey: { type: String, required: true },
    failureReason: String,
    isRead: { type: Boolean, default: false },
    sentAt: Date,
},
    { timestamps: true }
)

notificationSchema.index({ idempotencyKey: 1, channel: 1 }, { unique: true })
notificationSchema.index({ userId: 1, createdAt: -1 })

const Notification = mongoose.model("Notification", notificationSchema)
export default Notification