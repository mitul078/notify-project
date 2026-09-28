import { Queue } from "bullmq";
import connection from "../config/connection.js";

export const emailQueue = new Queue("notification-email", {
    connection,
    defaultJobOptions:{
        attempts:3,
        backoff:{type:"exponential", delay:5000},
        removeOnComplete:true
    }
})
