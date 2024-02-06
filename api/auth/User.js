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
        try {
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                // password matched
                // regenerate the session, which is good practice to help
                // guard against forms of session fixation
                req.session.regenerate(function (err) {
                  if (err) {
                    res
                      .status(500)
                      .json({ error: "Failed to generate user session!" });
                  } else {
                    // store user information in session, typically a user id
                    req.session.user = data[0]._id;
                    req.session.firstName = data[0].firstName;

                    // save the session before redirection to ensure page
                    // load does not happen before session is saved
                    req.session.save(function (err) {
                      if (err) {
                        res
                          .status(500)
                          .json({ error: "Failed to save user session!" });
                      } else {
                        res.status(201).json({
                          message: "Signed in successfully!",
                          data: data[0],
                        });
                      }
                    });
                  }
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
        } catch (error) {
          console.log(error);
          res
            .status(500)
            .json({ error: "An error occured while signing in user" });
        }
      }
    });
  }
});

router.post("/signout", (req, res) => {
  // Clear the user from the session object
  req.session.user = null;

  // No need to regenerate and save the session again since it's a sign-out
  // (Optional) You can destroy the session if you want to ensure that the session is completely removed from the store.
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ error: "Failed to sign out" });
    } else {
      res.status(201).json({ message: "Signed out successfully!" });
    }
  });
});

// Check session endpoint
router.get("/check-session", (req, res) => {
  const isAuthenticated = req.session.user ? true : false;

  res.json({
    authenticated: isAuthenticated,
  });
});

// get user name
router.get("/get-name", (req, res) => {
  const fName = req.session.firstName ? req.session.firstName : "User";

  res.json({
    name: fName,
  });
});

module.exports = router;
