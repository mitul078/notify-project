jest.mock("../../models/preference.model.js")

import NotificationPreference from "../../models/preference.model.js"
import { getEnabledChannels } from "../../services/preference.service.js"

afterEach(() => {
    jest.clearAllMocks()
})

describe("getEnabledChannels", () => {
    it("should return default channels when no preference is saved", async () => {
        NotificationPreference.findOne.mockReturnValue({ lean: () => Promise.resolve(null) })

        const channels = await getEnabledChannels("user-123", "resume.scored")

        expect(channels).toEqual(["in_app", "email"])
    })

    it("should exclude a channel the user has turned off", async () => {
        NotificationPreference.findOne.mockReturnValue({
            lean: () => Promise.resolve({ channels: { in_app: true, email: false, sms: false } }),
        })

        const channels = await getEnabledChannels("user-123", "resume.scored")

        expect(channels).toEqual(["in_app"])
        expect(channels).not.toContain("email")
    })

    it("should include sms only when the user has explicitly enabled it", async () => {
        NotificationPreference.findOne.mockReturnValue({
            lean: () => Promise.resolve({ channels: { in_app: true, email: true, sms: true } }),
        })

        const channels = await getEnabledChannels("user-123", "resume.scored")

        expect(channels).toContain("sms")
    })

    it("should return channel names as strings, not booleans", async () => {
        NotificationPreference.findOne.mockReturnValue({ lean: () => Promise.resolve(null) })

        const channels = await getEnabledChannels("user-123", "resume.scored")

        channels.forEach((c) => expect(typeof c).toBe("string"))
    })
})