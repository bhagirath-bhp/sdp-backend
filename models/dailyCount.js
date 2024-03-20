const mongoose = require('mongoose');

const dailyCountSchema = new mongoose.Schema({
    userId: String,
    clientsCount: [Number],
    ordersCount: [Number],
    productsCount: [Number],
    clientsCountTimeline: [String],
    ordersCountTimeline: [String],
    productsCountTimeline: [String],
});

module.exports = mongoose.model("DailyCount", dailyCountSchema);