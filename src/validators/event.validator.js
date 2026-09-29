import { z } from "zod"

export const eventSchema = z.object({
    eventType: z.string().min(1),
    userId: z.string().min(1),
    email: z.string().email(),
    idempotencyKey: z.string().min(1),
    data: z.record(z.string(), z.any()).default({}),
})