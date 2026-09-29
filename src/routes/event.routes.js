import { Router } from "express"
import internal from "../middlewares/internal.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { eventSchema } from "../validators/event.validator.js"
import { receiveEvent } from "../controllers/event.controller.js"

const router = Router()

router.post("/", internal, validate(eventSchema), receiveEvent)

export default router