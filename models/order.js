const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    bname: String,
    totalAmount: Number,
    // clientId: String,
    products: [{
        pname: String,
        pid: String,
        quantity: Number,
        price: Number
    }],
});

module.exports = mongoose.model("Orders", orderSchema);
