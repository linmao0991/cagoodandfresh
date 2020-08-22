// Requiring our models and passport as we've configured it
require('dotenv').config();
var db = require("../../models");
var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");

var bcrypt = require("bcryptjs");
const saltRounds = 10;

checkPermission = (user, threshold) =>{
    let permission;
    db.employees.findOne({
        where: {
            id: user
          }
        }).then(function (dbUser) {
          res.json({
            id: dbUser.id,
            username: dbUser.username,
            email: dbUser.email,
            first_name: dbUser.first_name,
            last_name: dbUser.last_name,
            home_id: dbUser.home_id,
            points: dbUser.points
          });
        });
}

//Log in
router.post("/login", passport.authenticate("local"), function (req, res) {
    console.log("===================================")
    console.log("[User Log In]")
    console.log("===================================")
    res.json(req.user);
  });


//Create employee
router.post("/create_employee", function (req, res) {
    console.log("===================================")
    console.log("[Create Employee]")
    console.log("===================================")
    db.employees.create({
        email: req.body.email,
        password: req.body.password,
    })
        .then(function (dbUser) {
        req.login(dbUser, function (err) {
            if (err) {
            console.log(err);
            }
        })
        res.json(dbUser);
        })
        .catch(function (err) {
        console.log(err.errors[0].message)
        res.status(401).json({ error: err.errors[0].message });

        });
});

//
// Route for getting some data about our user to be used client side
router.get("/user_data", function (req, res) {
    console.log("===================================")
    console.log("[Get User Data - 151]")
    console.log("===================================")
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({ response: "User Not Logged In" });
    } else {
      // Otherwise perform API call to find users updated information then send information back to client
      db.employees.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (dbUser) {
        res.json({
            user: req.user, 
            id: dbUser.id,
            email: dbUser.email,
        });
      });
    }
  });

module.exports = router;
