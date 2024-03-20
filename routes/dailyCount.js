const DailyCount = require("../models/dailyCount");
const router = require("express").Router();

router.get("/clients/:userId", async (req, res) => {
    const {userId} = req.params;
    try {
        const result = await DailyCount.aggregate([
            { $match: { userId: userId } },
            { $project: { 
                clientsCountLastSeven: { $slice: ["$clientsCount", -7] },
                clientsCountTimelineLastSeven: { $slice: ["$clientsCountTimeline", -7] }
            }}
        ]);

        if (!result || result.length === 0) {
            return { error: "No documents found" };
        }

        const { clientsCountLastSeven, clientsCountTimelineLastSeven } = result[0];

        return res.status(200).json({
            success: true,
            clientsCountLastSeven: clientsCountLastSeven,
            clientsCountTimelineLastSeven: clientsCountTimelineLastSeven,
        });
    } catch (error) {
        return { error: error.message };
    }
})
router.get("/products/:userId", async (req, res) => {
    const {userId} = req.params;
    try {
        const result = await DailyCount.aggregate([
            { $match: { userId: userId } },
            { $project: { 
                productsCountLastSeven: { $slice: ["$productsCount", -7] },
                productsCountTimelineLastSeven: { $slice: ["$productsCountTimeline", -7] }
            }}
        ]);

        if (!result || result.length === 0) {
            return { error: "No documents found" };
        }

        const { productsCountLastSeven, productsCountTimelineLastSeven } = result[0];

        return res.status(200).json({
            success: true,
            productsCountLastSeven: productsCountLastSeven,
            productsCountTimelineLastSeven: productsCountTimelineLastSeven,
        });
    } catch (error) {
        return { error: error.message };
    }
})
router.get("/orders/:userId", async (req, res) => {
    const {userId} = req.params;
    try {
        const result = await DailyCount.aggregate([
            { $match: { userId: userId } },
            { $project: { 
                ordersCountLastSeven: { $slice: ["$ordersCount", -7] },
                ordersCountTimelineLastSeven: { $slice: ["$ordersCountTimeline", -7] }
            }}
        ]);

        if (!result || result.length === 0) {
            return { error: "No documents found" };
        }

        const { ordersCountLastSeven, ordersCountTimelineLastSeven } = result[0];

        return res.status(200).json({
            success: true,
            ordersCountLastSeven: ordersCountLastSeven,
            ordersCountTimelineLastSeven: ordersCountTimelineLastSeven,
        });
    } catch (error) {
        return { error: error.message };
    }
})
router.get("/products/:userId", async (req, res) => {
    const {userId} = req.params;
    try {
        const result = await DailyCount.aggregate([
            { $match: { userId: userId } },
            { $project: { 
                productsCountLastSeven: { $slice: ["$productsCount", -7] },
                productsCountTimelineLastSeven: { $slice: ["$productsCountTimeline", -7] }
            }}
        ]);

        if (!result || result.length === 0) {
            return { error: "No documents found" };
        }

        const { productsCountLastSeven, productsCountTimelineLastSeven } = result[0];

        return res.status(200).json({
            success: true,
            productsCountLastSeven: productsCountLastSeven,
            ordersCountTimelineLastSeven: productsCountTimelineLastSeven,
        });
    } catch (error) {
        return { error: error.message };
    }
})

module.exports = router;