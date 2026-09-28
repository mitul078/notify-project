import mongoose from "mongoose"

const templateSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    channel: { type: String, enum: ["in_app", "email", "sms"], required: true },
    subject: String,
    body: { type: String, required: true },
}, { timestamps: true })

templateSchema.index({ eventType: 1, channel: 1 }, { unique: true })

const NotificationTemplate = mongoose.model("NotificationTemplate", templateSchema)
export default NotificationTemplate