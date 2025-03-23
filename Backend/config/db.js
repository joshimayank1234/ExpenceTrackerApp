import mongoose from "mongoose";
import "dotenv/config"

let MongoUri = process.env.MONGODB_URI ||  "mongodb://localhost:27017/ExpenceTracker"
export default function ConnectDB(){

    mongoose.connect(MongoUri).then(()=>console.log("MongoDb connected..."))
}