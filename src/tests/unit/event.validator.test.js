import { eventSchema } from "../../validators/event.validator.js"

describe("eventSchema", () => {
    const valid = {
        eventType: "resume.scored",
        userId: "user-123",
        email: "candidate@example.com",
        idempotencyKey: "resume.scored-app-001",
        data: { score: 88 },
    }

    it("should pass with a complete valid event", () => {
        expect(eventSchema.safeParse(valid).success).toBe(true)
    })

    it("should default data to an empty object when omitted", () => {
        const { data, ...rest } = valid
        const result = eventSchema.safeParse(rest)

        expect(result.success).toBe(true)
        expect(result.data.data).toEqual({})
    })

    it("should fail with an invalid email", () => {
        expect(eventSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false)
    })

    it("should fail when eventType is missing", () => {
        const { eventType, ...rest } = valid
        expect(eventSchema.safeParse(rest).success).toBe(false)
    })

    it("should fail when idempotencyKey is missing", () => {
        const { idempotencyKey, ...rest } = valid
        expect(eventSchema.safeParse(rest).success).toBe(false)
    })
})