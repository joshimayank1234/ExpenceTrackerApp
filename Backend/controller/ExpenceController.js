import ExpenseModal from "../model/ExpenceModel.js"

const ExpenseController = {
    // Get all expenses
    async getAllExpence(req, res) {
        try {
            const expenses = await ExpenseModal.find();
            res.json(expenses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a single expense by ID
    async getExpenceById(req, res) {
        try {
            const expense = await ExpenseModal.findById(req.params.id);
            if (!expense) return res.status(400).json({ message: "Expense not found" });
            res.json(expense);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add an expense
    async addExpence(req, res) {
        try {
            const newExpense = new ExpenseModal(req.body);
            await newExpense.save();
            res.status(201).json(newExpense);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update an expense
    async updateExpence(req, res) {
        try {
            const updatedExpense = await ExpenseModal.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true } // Returns updated document
            );
            if (!updatedExpense) return res.status(404).json({ message: "Expense not updated" });
            res.json(updatedExpense);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete an expense
    async deleteExpence(req, res) {
        try {
            const deletedExpense = await ExpenseModal.findByIdAndDelete(req.params.id);
            if (!deletedExpense) return res.status(404).json({ message: "Expense not deleted" });
            res.json({ message: "Expense deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get category-wise total expenses for a given month
    async getExpenseSummary(req, res) {
        try {
            console.log("Received request for summary with query:", req.query);
    
            const { month } = req.query;
    
            // Validate month format
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                console.log("Invalid month format:", month);
                return res.status(400).json({ error: "Invalid month format. Use YYYY-MM." });
            }
    
            const startDate = new Date(`${month}-01T00:00:00.000Z`);
            const endDate = new Date(startDate);
            endDate.setUTCMonth(endDate.getUTCMonth() + 1);
            
            console.log("Filtering expenses from:", startDate, "to:", endDate);
    
            const summary = await ExpenseModel.aggregate([
                { $match: { date: { $gte: startDate, $lt: endDate } } },
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
                { $sort: { total: -1 } },
            ]);
    
            console.log("Aggregation result:", summary);
    
            res.status(200).json({
                success: true,
                data: summary.length ? summary : [],
                message: summary.length ? "Expense summary fetched successfully." : "No expenses found for the given month."
            });
    
        } catch (error) {
            console.error("Error fetching expense summary:", error);
            res.status(500).json({ error: "Internal server error. Please try again later." });
        }
    }
    
};

export default ExpenseController;
