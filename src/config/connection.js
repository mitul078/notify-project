import IORedis from "ioredis"

const connection = new IORedis(process.env.REDIS_URI, {
    maxRetriesPerRequest: null
})

connection.on("connect", () => console.log("REDIS CONNECTED"))
connection.on("error" , () => console.log("REDIS FAILED TO CONNECT"))

export default connection