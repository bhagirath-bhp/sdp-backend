const Client = require("../models/client");
const Analyse = require("../models/analyse");
const DailyCount = require("../models/dailyCount");
const cookieToken = require("../utils/cookieToken");
const router = require("express").Router();


router.post("/add", async (req, res) => {
    const timeNow = new Date();
    const today = timeNow.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    try {
        if (!req.body.userId || !req.body.fname || !req.body.lname || !req.body.email || !req.body.phone || !req.body.verified) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const existingClient = await Client.findOne({ email: req.body.Email });
        if (existingClient) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const client = new Client({
            userId: req.body.userId,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            createdAt: timeNow,
            verified: req.body.verified,
        });
        const clientSuccess = await client.save();
        if (clientSuccess) {
            const existingDailyCount = await DailyCount.findOne({ userId: client.userId });

            if (existingDailyCount) {
                const lastEntryDate = existingDailyCount.clientsCountTimeline.slice(-1)[0];

                if (lastEntryDate === today) {
                    await DailyCount.findOneAndUpdate(
                        { userId: client.userId },
                        { $inc: { "clientsCount.$[lastElement]": 1 } },
                        { arrayFilters: [{ "lastElement": { $exists: true } }] }
                    );
                } else {
                    await DailyCount.findOneAndUpdate(
                        { userId: client.userId },
                        { $push: { clientsCount: 1, clientsCountTimeline: today } }
                    );
                }
            } else {
                const newDailyCount = new DailyCount({
                    userId: client.userId,
                    clientsCount: [1],
                    clientsCountTimeline: [today]
                });
                await newDailyCount.save();
            }

            return res.status(200).json({
                success: true,
                userId: client.userId,
                fname: client.fname,
                lname: client.lname,
                email: client.email,
                phone: client.phone,
                createdAt: client.createdAt,
                verified: client.verified,
            });
        }



    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});




router.get("/all/:userId", async (req, res) => {
    // const { pageNumber, pageSize } = req.body;
    const { userId } = req.params;
    try {
        if (!userId) {
            res.send(401).send({ message: "Unauthorized Access" })
        }
        let clientFrame = await Client.find({ userId: userId })
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        clientFrame = clientFrame.map(obj => {
            const { _id, userId, fname, lname, phone, email, createdAt, verified } = obj;
            return { id: _id, userId: userId, fname: fname, lname: lname, phone: phone, email: email, createdAt: createdAt, verified: verified };
        });

        if (clientFrame) {
            res.status(200).send(clientFrame);
        }
    } catch (error) {
        console.log(error)
    }
})
// router.update("/client/update", async (req, res) => {

// })


router.delete("/delete/:clientId", async (req, res) => {
    console.log("client")
    try {
        const { clientId } = req.params;
        const result = await Client.findOneAndDelete({ _id: clientId });

        if (result) {
            return res.status(200).json({ success: true, message: "Client deleted successfully" });
        } else {
            return res.status(404).json({ message: "Client not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error While Deleting Client");
    }
});


module.exports = router;