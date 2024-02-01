const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(bodyParser.json());

const User = require("../../models/user");

const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  let { fName, lName, email, password } = req.body;

  console.log(req.body);

  if (fName == "" || lName == "") {
    res.status(500).json({
      error: "Invalid input fields!",
    });
  } else if (!/^[a-zA-Z]*$/.test(fName)) {
    res.status(500).json({
      error: "Invalid first name entered",
    });
  } else if (!/^[a-zA-Z]*$/.test(lName)) {
    res.status(500).json({
      error: "Invalid last name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.status(500).json({
      error: "Invalid email entered",
    });
  } else if (password.length < 8) {
    res.status(500).json({
      error: "Password is too short!",
    });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.status(500).json({
            error: "User with the provided email already exists",
          });
        } else {
          try {
            //password handling
            const saltRounds = 10;
            bcrypt
              .hash(password, saltRounds)
              .then((hashedPassword) => {
                const newUser = new User({
                  firstName: fName,
                  lastName: lName,
                  email: email,
                  password: hashedPassword,
                });

                newUser
                  .save()
                  .then((result) => {
                    res.status(201).json({
                      message: "Successfully created an account!",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: "An error occured while saving the user account",
                    });
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: "An error occurred while creating an account",
                });
              });
          } catch (error) {
            console.log(error);
            res.status(500).json({
              error: "Failed to create an account",
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: " An error occured while checking for existing user!",
        });
      });
  }

  try {
    // const existingDate = await Date.findOne({ date });
    // let dateid;
    // let taskId;
    // if (existingDate) {
    //   // Date already exists, add the task to it
    //   existingDate.tasks.push(task);
    //   await existingDate.save();
    //   dateid = existingDate._id;
    //   taskId = existingDate.tasks[existingDate.tasks.length - 1]._id;
    // } else {
    //   // Date doesn't exist, create a new date document with the task
    //   const newDate = new Date({ date, tasks: [task] });
    //   await newDate.save();
    //   dateid = newDate._id;
    //   taskId = newDate.tasks[0]._id;
    // }
    // res
    //   .status(201)
    //   .json({ message: "Task added successfully", dateid, taskId });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while registering the user" });
  }
});

module.exports = router;
