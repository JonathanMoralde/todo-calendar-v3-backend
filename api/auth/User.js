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
});

router.post("/signin", (req, res) => {
  let { email, password } = req.body;

  if (email == "" || password == "") {
    res.status(500).json({
      error: "Empty credentials entered!",
    });
  } else {
    // Check if user exist
    User.find({ email }).then((data) => {
      if (data) {
        // User exist

        const hashedPassword = data[0].password;
        bcrypt
          .compare(password, hashedPassword)
          .then((result) => {
            if (result) {
              // password matched
              res.status(201).json({
                message: "Signed in successfully!",
                data: data,
              });
            } else {
              res.status(500).json({
                error: "Invalid password entered!",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: "Invalid credentials entered!",
            });
          });
      }
    });
  }
});

module.exports = router;
