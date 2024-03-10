const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    title: String,
    isCompleted: Boolean
});
module.exports = mongoose.model("Task", taskSchema);