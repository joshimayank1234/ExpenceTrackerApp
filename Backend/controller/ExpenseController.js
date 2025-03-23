import ExpenseModel from "../model/ExpenseModel.js";

const ExpenseController = {
  // ✅ Add Expense
  async addExpense(req, res) {
    try {
      const { amount, category, date, description } = req.body;

      if (!amount || amount < 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
      if (!date || isNaN(new Date(date).getTime())) {
        return res.status(400).json({ message: "Invalid date" });
      }

      const newExpense = new ExpenseModel({ amount, category, date, description });
      await newExpense.save();
      res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get All Expenses with Pagination and Filtering
  async getAllExpenses(req, res) {
    try {
      const { month, page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const query = {};

      if (month) {
        const startDate = new Date(`${month}-01T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setUTCMonth(endDate.getUTCMonth() + 1);
        query.date = { $gte: startDate, $lt: endDate };
      }

      const expenses = await ExpenseModel.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit));
      const totalCount = await ExpenseModel.countDocuments(query);

      res.status(200).json({
        success: true,
        data: expenses,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get Single Expense by ID
  async getExpenseById(req, res) {
    try {
      const expense = await ExpenseModel.findById(req.params.id);
      if (!expense) return res.status(404).json({ message: "Expense not found" });
      res.json({ success: true, data: expense });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Update Expense
  async updateExpense(req, res) {
    try {
      const updatedExpense = await ExpenseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedExpense) return res.status(404).json({ message: "Expense not updated" });
      res.json({ success: true, data: updatedExpense });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Delete Expense
  async deleteExpense(req, res) {
    try {
      const deletedExpense = await ExpenseModel.findByIdAndDelete(req.params.id);
      if (!deletedExpense) return res.status(404).json({ message: "Expense not deleted" });
      res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✅ Get Category-wise Summary
  async getExpenseSummary(req, res) {
    try {
      const { month } = req.query;
      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: "Invalid month format. Use YYYY-MM." });
      }

      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + 1);

      const summary = await ExpenseModel.aggregate([
        { $match: { date: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]);

      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Export JSON Report
  async exportExpenses(req, res) {
    try {
      const { month } = req.query;
      if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: "Invalid month format. Use YYYY-MM." });
      }

      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + 1);

      const expenses = await ExpenseModel.find({ date: { $gte: startDate, $lt: endDate } });

      if (!expenses.length) {
        return res.status(404).json({ message: "No expenses found for this month." });
      }

      res.setHeader('Content-Disposition', `attachment; filename="expenses-${month}.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(expenses, null, 2));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default ExpenseController;
