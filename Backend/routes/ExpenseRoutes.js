import { Router } from "express";
import ExpenseController from "../controller/ExpenseController.js";

const router = Router();

// Summary and Export - Place them first
router.get("/summary", ExpenseController.getExpenseSummary);
router.get("/export", ExpenseController.exportExpenses);

// CRUD Routes
router.post("/", ExpenseController.addExpense);
router.get("/", ExpenseController.getAllExpenses);
router.get("/:id", ExpenseController.getExpenseById);
router.put("/:id", ExpenseController.updateExpense);
router.delete("/:id", ExpenseController.deleteExpense);

export default router;
