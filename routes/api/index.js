// Requiring our models and passport as we've configured it
require('dotenv').config();
var db = require("../../models");
var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");
const axios = require('axios').default;

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_KEY);

var bcrypt = require("bcryptjs");
const e = require('express');
const cli = require('cli');
const saltRounds = 10;


//Function to check user permission level agianst required level for function.
checkPermission = (user, permission_req) =>{
  if(user.permission_level >= permission_req){
    return true
  }else{
    return false
  }
}

//Search yelp for potential new customers
router.post("/new_customer_search_yelp", (req, res) => {
  //request sends search requests as a array of searches i.e. ["&radius={radius}", "location={location}",...]
  let permission_req = 1;
  if(checkPermission(req.user, permission_req)){
    // let queryUrl = ""
    // console.log(req.body.searchParam)
    // let searchParam = [
    //   "https://api.yelp.com/v3/businesses/search?",
    //   "term=restaurants",
    //   "&categories=chinese",
    //   ...req.body.searchParam,
    //   "&sort_by=distance"
    // ]
    
    // searchParam.forEach(param => {
    //   console.log(param)
    //   if(param){
    //     queryUrl = queryUrl+param
    //   }
    // })

    //Yelps results is limited to 50
    //--Trying to find a way to call Yelp until all total results are retrived.
    //----While loop seesm very complicated and not efficient
    //----Using promises may be the answer
    //----see this stackoverflow for possible soltuion https://stackoverflow.com/questions/43064719/javascript-asynchronous-method-in-while-loop/43064993
    console.log(req.body)
    let promises = []
    let restaurants = []
    let offset = 0
    let totalResutus = null,

    while (restaurants.length < totalResutus || totalResutus === null){
      offset = offset+50
      promises.push(new Promise((resolve, reject) => {
        client.search({
          term: req.body.term,
          location: req.body.location,
          categories: req.body.categories,
          radius: req.body.radius,
          sort_by: "distance",
          limit: req.body.limit,
          offset: req.body.offset
        }).then( response => {
          if(!totalResutus){
            totalResutus = response.jsonBody.total;
          }
          restaurants = [...restaurants, ...response.jsonBody.businesses]
          resolve(response.jsonBody.businesses)
        }).catch(err => {
          console.log(err)
          reject()
        })
      }))
    }

    Promise.all(promises).then(() => {
      res.json(restaurants)
    })


    // axios({
    //   url: queryUrl,
    //   headers: {
    //     "Authorization": "Bearer "+process.env.YELP_KEY,
    //   },
    //   method: "GET",
    //   dataType: "json"
    // }).then(data => {
    //   console.log(data.data)
    //   res.json({
    //     data: data.data
    //   });
    // }).catch(err => {
    //   //res.json(err)
    //   console.log(err)
    // })
  }else{
    res.json({
      messege: "Permission level too low"
    })
  }
})


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

//Log Out
router.get("/logout", function (req, res) {
  console.log("===================================")
  console.log("[Log Out - 142]")
  console.log("===================================")
  req.logout();
  res.json({ message: "Logging out" });
});


//Create employee
router.post("/create_employee", (req, res) => {
    console.log("===================================")
    console.log("[Create Employee]")
    console.log("===================================")
    let permission_req = 3;
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
      //Convert search parameters object to array
      for (const property in req.body){
        //Checks search input for null or empty string and skips if null or empty
        if(req.body[property] !== "" && req.body[property] !== undefined){
          //Add current search parameter object to array
          searchArray.push({
            [property]: {
              [Op.or]: {
                //Find data that starts with search property
                [Op.startsWith]: req.body[property],
                //Find data that contains srarch property
                [Op.like]: "%"+req.body[property]}
              }
            })
          }
        }

      //Search database with searchArray
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

  //Get Product Categories
  router.get("/get_product_categories", (req, res) =>{
    let permission_req = 1;
    //Check Permission Level
    if (checkPermission(req.user, permission_req)){
      //Find category
      db.products.findAll({
        group: ["category"]
      }).then(data => {
        let categories = [];
        //Create array with only a list of categories
        for (const index in data){
          categories.push(data[index].dataValues.category)
        }
        res.json(categories)
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

  //Get all products by category
  router.post("/get_products_by_category", (req, res) =>{
    let permission_req = 1;
    if (checkPermission(req.user, permission_req)){
      //Find all products from category
      db.products.findAll({
        where: {
          category: req.body.category
        }
      }).then(data => {
        res.json(data)
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

  router.post("/get_inventory_by_product_code",(req, res) => {
    let permission_req = 1;
    if(checkPermission(req.user, permission_req)){
      db.inventory.findAll({
        where: {
          [Op.and]: [
            {product_code: req.body.productCode},
            {current_quantity: {[Op.gt]: 0}}
          ]
        }
      }).then( data =>{
        //console.log(data)
        res.json(data);
      }).catch( err => {
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
