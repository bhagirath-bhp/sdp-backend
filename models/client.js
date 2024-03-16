const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
    userId: String,
    fname: String,
    lname: String,
    email: String,
    phone: String,
    createdAt: Date,
    verified: Boolean,
});
module.exports = mongoose.model("Client", clientSchema);