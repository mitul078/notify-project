import NotificationPreference from "../models/preference.model.js"

const DEFAULT = { in_app: true, email: true, sms: false }

export async function getEnabledChannels(userId, eventType) {
    const pref = await NotificationPreference.findOne({ userId, eventType }).lean()
    const channels = { ...DEFAULT, ...(pref?.channels || {}) }

    return Object.entries(channels)
        .filter(([, enabled]) => enabled)
        .map(([key]) => key)
}