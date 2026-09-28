import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

export async function list(req, res, next) {
    try {

        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50)
        const filter = { userId: req.user.id, channel: "in_app" }

        if (req.query.cursor) {
            if (!mongoose.Types.ObjectId.isValid(req.query.cursor)) {
                return res.status(400).json({ message: "INVALID CURSOR" })
            }
            filter._id = { $lt: req.query.cursor }
        }

        const notifications = await Notification.find(filter)
            .select("eventType body isRead createdAt")
            .sort({ _id: -1 })
            .limit(limit)
            .lean()

        const next_cursor = notifications.length === limit ? notifications[notifications.length - 1]._id : null
        res.json({ notifications, next_cursor })

    } catch (error) {
        next(error)

    }
}


export async function unreadCount(req, res, next) {
    try {
        const count = await Notification.countDocuments({ userId: req.user.id, channel: "in_app", isRead: false })
        res.json({ count })
    } catch (err) {
        next(err)
    }
}

export async function markRead(req, res, next) {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "INVALID ID" })
        }

        const updated = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { new: true }
        ).select("isRead")

        if (!updated) return res.status(404).json({ message: "NOTIFICATION NOT FOUND" })
        res.json({ notification: updated })
    } catch (err) {
        next(err)
    }
}


export async function markAllRead(req, res, next) {
    try {
        const result = await Notification.updateMany(
            { userId: req.user.id, channel: "in_app", isRead: false },
            { isRead: true }
        )
        res.json({ updated: result.modifiedCount })
    } catch (err) {
        next(err)
    }
}