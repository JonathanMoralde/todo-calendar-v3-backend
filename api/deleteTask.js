const express = require("express");
const bodyParser = require("body-parser");
const Date = require("../models/task");

const router = express.Router();
router.use(bodyParser.json());

router.delete("/deleteTask/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    const taskDate = await Date.findOne({ "tasks._id": taskId });

    if (taskDate) {
      // Use $pull to remove the task with the specified _id from the tasks array
      if (taskDate.tasks.length === 1) {
        await taskDate.deleteOne();
      } else {
        await taskDate.updateOne({ $pull: { tasks: { _id: taskId } } });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured while deleting" });
  }
});

module.exports = router;
