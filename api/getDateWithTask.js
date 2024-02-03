const express = require("express");
const bodyParser = require("body-parser");
const Date = require("../models/task");

const router = express.Router();
router.use(bodyParser.json());

router.get("/getDates", async (req, res) => {
  const userId = req.session.user;
  try {
    const allDatesWithTask = await Date.find({ userId: userId });
    res.status(200).json(allDatesWithTask);
  } catch (error) {
    res.status(500).json({ error: "Error occured while fetching data" });
  }
});

module.exports = router;
