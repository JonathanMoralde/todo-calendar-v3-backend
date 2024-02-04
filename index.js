const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const addTask = require("./api/addTask");
const getTask = require("./api/getTask");
const getDates = require("./api/getDateWithTask");
const updateTask = require("./api/updateTask");
const updateTaskStatus = require("./api/updateTaskStatus");
const deleteTask = require("./api/deleteTask");
const userRouter = require("./api/auth/User");

require("dotenv").config();

const app = express();
const PORT = process.env.port || 5000;

// MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    //must add in order to not get any error masseges:
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log(err));

const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions", // Collection name to store sessions in MongoDB
  expires: 1000 * 60 * 60 * 24 * 7, // Session will expire after 7 days (adjust as needed)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Python whey",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie will expire after 7 days (adjust as needed)
      httpOnly: false,
    },
  })
);

// Allow requests from http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    optionSuccessStatus: 201,
  })
);

// POST - NEW TASK
app.use("/api", addTask);

// GET - SPECIFIC DATE TAKS
app.use("/api", getTask);

// GET - ALL DATES WITH TASKS
app.use("/api", getDates);

// UPDATE TASK DESCRIPTION
app.use("/api", updateTask);

// UPDATE TASK STATUS
app.use("/api", updateTaskStatus);

// DELETE TASK
app.use("/api", deleteTask);

// signin & signup USER
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Listening on: ${PORT}`));
