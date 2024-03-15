const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    bname: String,
    clientId: String,
    userId: String,
    products: [{
        pname: String,
        pid: String,
        quantity: Number,
        price: Number
    }],
});

module.exports = mongoose.model("Orders", orderSchema);
