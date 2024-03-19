const Analyse = require("../models/analyse");
const router = require("express").Router();

router.get("/analyse/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const analyse = await Analyse.findOne({ userId });
        res.status(200).json({success: true, data: analyse});
    } catch (error) {
        console.error("Error finding Analyse:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;