import {createClient} from "redis";

const redisClient = createClient();

redisClient.on("error",(err)=>console.log("Redis Error",err));
redisClient.on("connect",()=>console.log("Redis connected"));

await redisClient();

export default redisClient;