import { eventQueue } from "../queues/event.queue.js"

export async function receiveEvent(req, res, next) {
    try {
        await eventQueue.add(req.body.eventType, req.body)
        res.status(202).json({ message: "EVENT ACCEPTED" })
    } catch (err) {
        next(err)
    }
}