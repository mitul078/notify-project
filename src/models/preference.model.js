import mongoose from "mongoose"

const preferenceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    eventType: { type: String, required: true },
    channels: {
        in_app: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
    },
}, { timestamps: true })

preferenceSchema.index({ userId: 1, eventType: 1 }, { unique: true })

const NotificationPreference = mongoose.model("NotificationPreference", preferenceSchema)
export default NotificationPreference