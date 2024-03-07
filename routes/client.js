const Client = require("../models/client");
const cookieToken = require("../utils/cookieToken");
const router = require("express").Router();


router.post("/client/add", async (req, res) => {
    console.log(req.body)
    try {
        if (!req.body.fname || !req.body.lname || !req.body.email || !req.body.phone || !req.body.createdAt || !req.body.verified) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const existingClient = await Client.findOne({ email: req.body.Email });
        if (existingClient) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const client = new Client({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            createdAt: req.body.createdAt,
            verified: req.body.verified,
        });
        const clientSuccess = await client.save();
        if (clientSuccess) {
            return res.status(200).json({
                success: true,
                fname: client.fname,
                lname: client.lname,
                email: client.email,
                phone: client.phone,
                createdAt: client.createdAt,
                verified: client.verified,
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/client/all", async (req, res) => {
    // const { pageNumber, pageSize } = req.body;
    try {
        let clientFrame = await Client.find({})
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        clientFrame = clientFrame.map(obj => {
            const { _id, fname, lname, phone, email, createdAt, verified } = obj;
            return { id: _id, fname: fname, lname: lname, phone: phone, email: email, createdAt: createdAt, verified: verified };
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


module.exports = router;