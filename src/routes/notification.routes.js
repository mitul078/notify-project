import { Router } from "express"
import authenticate from "../middlewares/authenticate.js"
import { list, unreadCount, markRead, markAllRead } from "../controllers/notification.controller.js"

const router = Router()

router.get("/", authenticate, list)
router.get("/unread-count", authenticate, unreadCount)
router.patch("/read-all", authenticate, markAllRead)
router.patch("/:id/read", authenticate, markRead)

export default router