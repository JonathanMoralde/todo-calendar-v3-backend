const express = require("express");
const bodyParser = require("body-parser");
const Date = require("../models/task");

const router = express.Router();

router.use(bodyParser.json());

router.post("/addTask", async (req, res) => {
  const { date, task } = req.body;

  const isAuthenticated = req.session.user ? true : false;

  console.log(req.body);
  console.log(isAuthenticated);

  if (isAuthenticated === false) {
    res.status(500).json({ error: "You are not signed in!" });
  } else {
    const userId = req.session.user;
    try {
      const existingDate = await Date.findOne({ date, userId });

      let dateid;
      let taskId;

      if (existingDate) {
        // Date already exists, add the task to it
        existingDate.tasks.push(task);
        await existingDate.save();
        dateid = existingDate._id;
        taskId = existingDate.tasks[existingDate.tasks.length - 1]._id;
      } else {
        // Date doesn't exist, create a new date document with the task
        const newDate = new Date({
          date,
          tasks: [task],
          userId: req.session.user,
        });
        await newDate.save();
        dateid = newDate._id;
        taskId = newDate.tasks[0]._id;
      }

      res
        .status(201)
        .json({ message: "Task added successfully", dateid, taskId });
    } catch (err) {
      res
        .status(500)
        .json({ error: "An error occurred while adding the task" });
    }
  }
});

module.exports = router;
