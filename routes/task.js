const router = require("express").Router();
const Task = require("../models/task");


router.post("/add", async (req, res) => {
    console.log(req.body)
    try {
        if (!req.body.title) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const task = new Task({
            title: req.body.title,
            isCompleted: false,
        });

        if(task){
            return res.status(200).json({ message: "Task added successfully" });
        }
        else{
            return res.status(400).json({ message: "Error saving task!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;