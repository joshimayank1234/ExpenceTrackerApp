import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import "dotenv/config"
import AddExpencesRoute from "./routes/AddExpencesRoute.js"
import ConnectDB from "./config/db.js";

const port = process.env.PORT || 5600

// Midddlewares
let app = express();
app.use(cors());
app.use(bodyParser.json());

//Routes:
app.use("/expenses",AddExpencesRoute);

//DataBase Connection 
ConnectDB();


// Listing Server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});