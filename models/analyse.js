const mongoose = require("mongoose");
const analyseSchema = new mongoose.Schema({
    name: String,
    userId: String,
    clients: [{clientID: String, slug: String}],
    products: [{productID: String, slug: String, price: Number}],
    orders: [{orderID: String, slug: String, amount: Number}],
    clientsTimeline: [Date],
    productsTimeline: [Date],
    ordersTimeline: [Date],
}); 
module.exports = mongoose.model("Analyse", analyseSchema);