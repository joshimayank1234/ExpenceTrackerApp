import mongoose from "mongoose";

let ExpenceSchema = new mongoose.Schema({

    amount:{type:Number},
    category:{type:String},
    date:{type:Date},
    description:{type:String}

});

export default mongoose.model("Expense",ExpenceSchema);