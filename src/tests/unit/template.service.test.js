jest.mock("../../models/template.model.js")

import NotificationTemplate from "../../models/template.model.js"
import { renderTemplate } from "../../services/template.service.js"

afterEach(() => {
    jest.clearAllMocks()
})

describe("renderTemplate", () => {
    it("should fill placeholders with the given data", async () => {
        NotificationTemplate.findOne.mockReturnValue({
            lean: () =>
                Promise.resolve({
                    subject: "Your score for {{jobTitle}}",
                    body: "Hi {{candidateName}}, you scored {{score}}/100.",
                }),
        })

        const result = await renderTemplate("resume.scored", "email", {
            candidateName: "Mitul",
            jobTitle: "Backend Engineer",
            score: 88,
        })

        expect(result.subject).toBe("Your score for Backend Engineer")
        expect(result.body).toBe("Hi Mitul, you scored 88/100.")
    })

    it("should return null when no template exists for the event/channel pair", async () => {
        NotificationTemplate.findOne.mockReturnValue({ lean: () => Promise.resolve(null) })

        const result = await renderTemplate("unknown.event", "email", {})

        expect(result).toBeNull()
    })

    it("should render without a subject for channels that don't use one", async () => {
        NotificationTemplate.findOne.mockReturnValue({
            lean: () => Promise.resolve({ body: "You scored {{score}}/100." }),
        })

        const result = await renderTemplate("resume.scored", "in_app", { score: 75 })

        expect(result.subject).toBeUndefined()
        expect(result.body).toBe("You scored 75/100.")
    })

    it("should escape HTML in interpolated values by default", async () => {
        NotificationTemplate.findOne.mockReturnValue({
            lean: () => Promise.resolve({ body: "Hi {{candidateName}}!" }),
        })

        const result = await renderTemplate("resume.scored", "email", {
            candidateName: "<script>alert(1)</script>",
        })

        expect(result.body).not.toContain("<script>")
        expect(result.body).toContain("&lt;script&gt;")
    })
})