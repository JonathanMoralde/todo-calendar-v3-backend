const express = require("express");
const Date = require("../models/task");

const router = express.Router();

router.use(express.json());

router.put("/updateTask", async (req, res) => {
  const { taskId, u_description } = req.body;

  try {
    const taskDate = await Date.findOne({ "tasks._id": taskId });

    if (taskDate) {
      const taskIndex = taskDate.tasks.findIndex((task) => task._id == taskId);

      if (taskIndex !== -1) {
        taskDate.tasks[taskIndex].description = u_description;
        // Save the changes to the taskDate document
        await taskDate.save();

        res.status(200).json({ message: "Task updated successfully!" });
      } else {
        res.status(404).json({ error: "Could not find the task" });
      }
    } else {
      res.status(404).json({ error: "Date not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating the task" });
  }
});

module.exports = router;
