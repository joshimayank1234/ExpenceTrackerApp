import mongoose from "mongoose";

// Expense Schema
let ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    index: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

// Create a compound index for faster queries
ExpenseSchema.index({ category: 1, date: 1 });

export default mongoose.model("Expense", ExpenseSchema);
