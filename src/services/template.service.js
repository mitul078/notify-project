import Handlebars from "handlebars";
import NotificationTemplate from "../models/template.model.js";

export async function renderTemplate(eventType, channel, data) {
    const template = await NotificationTemplate.findOne({ eventType, channel }).lean()
    if (!template) return null

    return {
        subject: template.subject ? Handlebars.compile(template.subject)(data) : undefined,
        body:Handlebars.compile(template.body)(data)
    }
}