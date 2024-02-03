const express = require("express");
const bodyParser = require("body-parser");
const Date = require("../models/task");

const router = express.Router();
router.use(bodyParser.json());

router.get("/getTask/:date", async (req, res) => {
  const date = req.params.date;
  const userId = req.session.user;

  try {
    const dateTasks = await Date.findOne({ date: date, userId: userId });
    if (dateTasks) {
      const tasks = dateTasks.tasks;

      if (tasks) {
        res.status(200).json(tasks);
      } else {
        res.status(404).json({ error: "No tasks for this date yet" });
      }
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured while getting the tasks" });
  }
});

module.exports = router;
