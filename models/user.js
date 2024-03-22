const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    companyName: String,
    ownerName: String,
    email: String,
    phone: String,
    address: String,
    password: String,
    profileURL: String,
    cloudinary_id: String,
});
module.exports = mongoose.model("User", userSchema);