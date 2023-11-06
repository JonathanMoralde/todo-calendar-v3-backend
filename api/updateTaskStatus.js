const express = require("express");
const Date = require("../models/task");

const router = express.Router();
router.use(express.json());

router.put("/updateTaskStatus", async (req, res) => {
  const { taskId, u_completed } = req.body;

  try {
    const taskDate = await Date.findOne({ "tasks._id": taskId });

    if (taskDate) {
      const taskIndex = taskDate.tasks.findIndex((task) => task._id == taskId);
      if (taskIndex !== -1) {
        taskDate.tasks[taskIndex].completed = u_completed;

        // Save the changes to the taskDate document
        await taskDate.save();
        res
          .status(200)
          .json({ message: "Task status updated successfully!", taskDate });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } else {
      res.status(404).json({ error: "Date not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occurred while updating status" });
  }
});

module.exports = router;
