// Requiring our models and passport as we've configured it
require('dotenv').config();
var db = require("../../models");
var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");

var bcrypt = require("bcryptjs");
const e = require('express');
const saltRounds = 10;


//Function to check user permission level agianst required level for function.
checkPermission = (user, permission_req) =>{
  if(user.permission_level >= permission_req){
    return true
  }else{
    return false
  }
}

//Log in
router.post("/login", passport.authenticate("local"), (req, res) => {
    console.log("===================================")
    console.log("[User Log In]")
    console.log("===================================")
    res.json({
      id: req.user.id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      permission_level: req.user.permission_level,
    });
  });


//Create employee
router.post("/create_employee", (req, res) => {
    console.log("===================================")
    console.log("[Create Employee]")
    console.log("===================================")
    const permission_req = 3;
    if (checkPermission(req.user, permission_req)) {
      db.employees.create({
        email: req.body.email,
        password: req.body.password,
        })
          .then((dbUser) => {
          req.login(dbUser, (err) => {
              if (err) {
              console.log(err);
              }
          })
          res.json(dbUser);
          })
          .catch((err) => {
          console.log(err.errors[0].message)
          res.status(401).json({ error: err.errors[0].message });
        });
    }else{
      res.json({
        messege: "Permission level too low"
      })
    }
});

// Route for getting some data about our user to be used client side
router.get("/user_data", (req, res) => {
    console.log("===================================")
    console.log("[Get User Data - 151]")
    console.log("===================================")
    if (!req.user) {
      // The user is not logged in, send back an empty object
      //res.json({ response: "User Not Logged In" });
      res.status(401).send("Not Logged In")
    } else {
      // Otherwise perform API call to find users updated information then send information back to client
      db.employees.findOne({
        where: {
          id: req.user.id
        }
      }).then((dbUser) => {
        res.json({
            user: req.user, 
            id: dbUser.id,
            email: dbUser.email,
            permission_level: dbUser.permission_level
        });
      });
    }
  });

  //Find customer 
  router.post("/find_customer", (req, res) => {
    let permission_req = 1;
    //Check for user permission level
    if (checkPermission(req.user, permission_req)) {
      let searchArray =[];
      //Convert object to array with search parameters
      for (const property in req.body){
        //Checks search input for null or empty string
        if(req.body[property] !== "" && req.body[property] !== undefined){
          searchArray.push({
            [property]: {
              [Op.or]: {
                //Find data that starts with search property
                [Op.startsWith]: req.body[property],
                //Find ata that contains srarch property
                [Op.like]: "%"+req.body[property]}
              }
            })
          }
        }

      //Call database with
      db.customers.findAll({
        where: {
          [Op.and]: searchArray
        }
      }).then( (dbCustomer) => {
        res.json(dbCustomer)
      }).catch((err) => {
        console.log(err.errors[0].message)
        res.status(404).json({ error: err.errors[0].message });
      })
    }else{
      res.json({
        messege: "Permission level too low"
      })
    }
  });

module.exports = router;
