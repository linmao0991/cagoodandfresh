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
    console.log("==[Find Customer - Line 94]==")
    console.log(req.body)
    console.log("=======================")
    // db.customers.findAll({
    //   where: {
    //     [Op.or]: [
    //       {customer_account_number: req.body.account_number},
    //       {business_phone_number: req.body.phone_number},
    //       {restaurant_name_english: req.body.restaurant_name}
    //     ]
    //   }
    // }).then( (dbCustomer) => {
    //   res.json({
    //     customer_info: dbCustomer
    //   })
    // }).catch((err) => {
    //   console.log(err.errors[0].message)
    //   res.status(404).json({ error: err.errors[0].message });
    // })
  });

module.exports = router;
