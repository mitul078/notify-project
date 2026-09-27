import IORedis from "ioredis"

const connection = new IORedis(process.env.REDIS_URI,{
    maxRetriesPerRequest: null
})