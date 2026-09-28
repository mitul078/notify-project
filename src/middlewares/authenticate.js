import jwt from "jsonwebtoken"

export default function authenticate(req, res, next) {
    const header = req.headers.authorization
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "SIGN IN TO ACCESS RESOURCES" })
    }

    try {
        const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET)
        req.user = { id: String(decoded.id) }
        next()
    } catch {
        res.status(401).json({ message: "INVALID TOKEN" })
    }
}