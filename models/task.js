const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: String,
  completed: Boolean,
});

const dateSchema = new mongoose.Schema({
  date: String,
  tasks: [taskSchema],
  userId: String,
});

const Date = mongoose.model("Date", dateSchema);

module.exports = Date;
