import { Router } from "express";
import ExpenceController from "../controller/ExpenceController.js";


const router = Router();

//Get all expence
router.get("/",ExpenceController.getAllExpence);


//Get single expence
router.get("/:id",ExpenceController.getExpenceById);

//Add new expence
router.post("/",ExpenceController.addExpence);

//Update expence
router.put("/:id",ExpenceController.updateExpence);

//Delete expence
router.delete("/:id",ExpenceController.deleteExpence);

// Get category-wise total expenses for a given month
router.get("/summary",ExpenceController.getExpenseSummary);


export default router;