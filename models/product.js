const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    imageURL: String,
    pname: String,
    price: String,
    producer: String,
    quantity: Number,
    lastUpdated: String,
});
module.exports = mongoose.model("Product", productSchema);