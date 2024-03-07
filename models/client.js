const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    phone: String,
    createdAt: Date,
    verified: Boolean,
});
module.exports = mongoose.model("Client", clientSchema);