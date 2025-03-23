import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import "dotenv/config"
import ConnectDB from "./config/db.js";
import ExpenseRoutes from "./routes/ExpenseRoutes.js"
const port = process.env.PORT || 5600

// Midddlewares
let app = express();
app.use(cors());
app.use(bodyParser.json());

//Routes:
app.use("/expenses", ExpenseRoutes);
//DataBase Connection 
ConnectDB();


// Listing Server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});