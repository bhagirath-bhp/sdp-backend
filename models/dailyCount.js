const mongoose = require('mongoose');

const dailyCountSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    clientsCount: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    productsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("DailyCount", dailyCountSchema);