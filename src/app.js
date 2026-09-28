import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json({ limit: "100kb" }))

app.get("/health", (req, res) => res.json({ status: "ok" }))


app.use((req, res) => res.status(404).json({ message: "ROUTE NOT FOUND" }))
app.use((err, req, res, next) => {
    const status = err.statusCode || 500
    if (status === 500) console.error(err)
    res.status(status).json({ message: status === 500 ? "INTERNAL SERVER ERROR" : err.message })
})

export default app