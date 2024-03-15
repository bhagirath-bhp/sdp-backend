const router = require("express").Router();
const Task = require("../models/task");

router.post("/add", async (req, res) => {
  try {
    const { title } = req.body;
    console.log(req.body)
    if (!title) {
      return res.status(400).json({ message: "Incomplete Data" });
    }
    
    const task = new Task({
      title,
      isCompleted: false,
    });

    await task.save(); // Save the task to the database

    return res.status(200).json({ message: "Task added successfully", success: true });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/all", async (req, res) => {
    try {
        let taskFrame = await Task.find({})
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)

        if (taskFrame) {
            res.status(200).send(taskFrame);
        }
    } catch (error) {
        console.log(error)
    }
})
router.delete("/delete", async (req, res) => {
    const {tid} = req.query
    try {
        const response = await Task.deleteOne({_id: tid})
        if(response)
            res.status(200).send({success: true, message: "Task deleted successfully!"});

    } catch (error) {
        console.log(error)
    }
})
router.put("/update", async (req, res) => {
    const {tid} = req.query
    try {
        const response = await Task.updateOne({_id: tid}, {isCompleted: true});
        res.status(200).send({success: true, message: "Task completed successfully!"});

    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
