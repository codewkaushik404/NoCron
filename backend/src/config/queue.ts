import { Queue } from "bullmq";
import config from "./config.js";

const executionQueue = new Queue(config.QUEUE_NAME, {
    connection: {
        host: config.REDIS_HOST,
        port: Number(config.REDIS_PORT)
    }
})

export default executionQueue;