import express from "express";
import config from "../config/config.js";
import publishOutboxToQueue from "../services/outbox.service.js";

const app = express();

let isSweeperRunning = false;
const POLLING_INTERVAL = 3*60*1000; //3 min

async function sweeperServer(){
    if(isSweeperRunning) return;
    isSweeperRunning = true;
    try{
        await publishOutboxToQueue();
    }
    catch(err){
        console.error("Error in sweeperServer: ", err);
    }
    finally{
        isSweeperRunning = false;
    }
}

app.listen(config.SWEEPER_PORT, () => {
    console.log(`Outbox Sweeper service is running on :${config.SWEEPER_PORT}`);
    sweeperServer();
    setInterval(sweeperServer, POLLING_INTERVAL);
});