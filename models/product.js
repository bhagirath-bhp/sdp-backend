const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    userId: String,
    imageURL: String,
    pname: String,
    price: String,
    producer: String,
    quantity: Number,
    lastUpdated: Date,
});
module.exports = mongoose.model("Product", productSchema);