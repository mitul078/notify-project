import "dotenv/config"
import jwt from "jsonwebtoken"

console.log(jwt.sign({ id: "user-123" }, process.env.JWT_SECRET, { expiresIn: "1d" }))