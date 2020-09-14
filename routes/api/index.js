// Requiring our models and passport as we've configured it
require('dotenv').config();
var path = require("path")
var db = require("../../models");
var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_KEY);

var bcrypt = require("bcryptjs");
const e = require('express');
const cli = require('cli');
const { sequelize } = require('../../models');
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
  console.log("===================================")
  console.log("[Search for Restaurants]")
  console.log("===================================")
  let permission_req = 1;
  if(checkPermission(req.user, permission_req)){
    //Declare our restaurants result array
    let restaurants = []

    //Promise for yelp API call
    const yelpsearch = (offset) => {
      return new Promise((resolve, reject) => {
        client.search({
          //search business type (restaurants, gas stations, ...etc)
          term: req.body.term,
          //search center at this location
          location: req.body.location,
          //filter by categories (chinese, japanese,...etc)
          categories: req.body.categories,
          //Search radius from location ( in meters)
          radius: req.body.radius,
          //Sort results by
          sort_by: "distance",
          //limit results default is 20, max is 50
          limit: req.body.limit,
          //offset results.
          offset: offset
        }).then( response => {
          //Filters out restaurants with no phone numbers, usually means restaurant is permanently closed
          let validPhoneOnly = response.jsonBody.businesses.filter(restaurants => {
            return (restaurants.phone? restaurants: null);
          })
          //Add validPhoneOnly restaurants to our restaurant array.
          restaurants = [...restaurants, ...validPhoneOnly]
          //resolves promise with lenght of business array length (results yelp gave us max 50) and total results
          resolve({arrayLength: response.jsonBody.businesses.length, totalResults: response.jsonBody.total})
        }).catch(err => {
          reject(err)
        })
      })
    }

    //Promise all to run when all promises are complete. Currently not useful, but if you were to add multi-location search this would work well.
    Promise.all([yelpsearch(0)]).then( results => {
      //Set values from returned promise at array index 0
      let yelpStats = results[0]
      //Declares multiYelp array for later promise all
      let multiYelp = []
      // Run only if there are total results over 50 and if returned results is at max 50
      if(yelpStats.arrayLength === 50 && yelpStats.totalResults > 50){
        //Calculating total iterations for loop rounding up
        let totalIteration = Math.ceil((yelpStats.totalResults-yelpStats.arrayLength)/50);
        //for loop starting at 1 and ending at total iterations +1. 
        for ( let i = 1; i < totalIteration+1; i++){
          //pushing yelpsearch promise in multiYelp array and setting offset by 50*i
          //----This will run our promises with correct offets to return total results from yelp
          multiYelp.push(yelpsearch(50*i))
        }
        //Promise all to run all the multiYelp array promises and then send the combined restuants array to client
        Promise.all(multiYelp).then(()=>{
          res.json(restaurants)
        })
      }else{
        //If yelp returns less than 50 businesses and total results is less than 50. Then return restaurants. This means there were not more than the max 50 results
        res.json(restaurants)
      }
    })
  }else{
    res.json({
      messege: "Permission level too low"
    })
  }
})

//Filter out current customers from the restaurant search
router.post("/filter_restaurant_search", (req, res)=>{
  console.log("===================================")
  console.log("[Filter Restaurant Search Results]")
  console.log("===================================")
  //Function that recieves all active current customers and restaurant search results. Then compares and removes active customers from the restaurant search results
  const removeCurrentCustomers = (getCurrentCustomers, yelpResults) => {
    //Run array filter on restaurant search and set returned values into newCustomers array
    let newCustomers = yelpResults.filter(restaurant => {
      //Use array find to go though active customers and compare with current restaurant in the search results
      let duplicate = getCurrentCustomers.find(customer => {
        //Returns boolean value based on matching phone numbers
        return(customer.business_phone_number === restaurant.phone.slice(-10)?true:false)
      })
      //If duplcaite is true then don't return restaurant because it is a current customer. If false then return thr restaurant data
      return (duplicate ? null : restaurant)
    })
    return newCustomers
  }

  //Search customers table for all active customers
  db.customers.findAll({
    where:{
      active_customer: true
    }
  }).then( results => {
    //Send results of database search and restaurant search data to removeCurrentCustomers.
    let filteredResults = removeCurrentCustomers(results, req.body.restaurants)
    //Return filtered results
    res.json(filteredResults)
  }).catch( error => {
    res.json(error)
  })
})

//Create CSV for exporting to client.
router.post("/create_restaurant_csv",(req, res)=>{
  console.log("===================================")
  console.log("[Create CSV]")
  console.log("===================================")
  //sets filePath with path and name of the file
  let filePath = path.join(__dirname, '../../csv/'+req.body.csvName+'.csv');
  //Use csv Writer and write the header for the csv file
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      {id: 'name', title: 'Name'},
      {id: 'address', title: 'Address'},
      {id: 'address2', title: 'Address2'},
      {id: 'address3', title: 'Address3'},
      {id: 'city', title: 'City'},
      {id: 'state', title: 'State'},
      {id: 'zipcode', title: 'Zip'},
      {id: 'phone', title: 'Phone'},
      {id: 'latitude', title: 'Latitude'},
      {id: 'longitude', title: 'Longitude'},
    ]
  });

  //Sets map though our restaurant search results and formats it to match our csv header.
  let data = req.body.restaurants.map((restaurant)=>{
    let dataEntry = {
      name: restaurant.name,
      address: restaurant.location.address1,
      address2: restaurant.location.address2,
      address3: restaurant.location.address3,
      city: restaurant.location.city,
      state: restaurant.location.state,
      zip: restaurant.location.zip_code,
      phone: restaurant.phone,
      latitude: restaurant.coordinates.latitude,
      longitude: restaurant.coordinates.longitude
    }
    return dataEntry;
  })

  //use csvWriter to create the csv file using our data. Then sending true back to client
  csvWriter
    .writeRecords(data)
    .then(()=> {
      console.log('The CSV file was written successfully')
      res.json({
        created: true
      })
    });
})

//Route to download created restaurant search result csv
router.get("/download_csv/:id", (req,res)=>{
  console.log("===================================")
  console.log("[Download CSV]")
  console.log("===================================")
  //sets the file path to our csv file. This route is ran immediatly after creating the csv file. The name of the csv file is sent with this get.
  let filePath = path.join(__dirname, '../../csv/'+req.params.id+'.csv');
  //send csv file to client for download
  res.download(filePath)
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
        // include: [
        //   [
        //     sequelize.literal(`(
        //       SELECT COUNT(*)
        //     )`)
        //   ]
        // ],
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

  //Search inventory by search input
  router.post("/search_inventory_by_input", (req, res) => {
    let permission_req = 1;
    if(checkPermission(req.user, permission_req)){
      db.products.findAll({
        where:{
          [Op.or]: [
            {id: req.body.searchInput},
            {name_english: {[Op.substring]: req.body.searchInput}}, 
            {name_chinese: {[Op.substring]: req.body.searchInput}}
          ]
        }
      }).then( result => {
        console.log(result[0])
        res.json(result)
      }).catch( error => {
        console.log(error)
        res.json(error)
      })
    }else{
      res.json({
        messege: "Permission level too low"
      })
    }
  })

  //Get inventory by product code (product id)
  router.post("/get_inventory_by_product_code",(req, res) => {
    let permission_req = 1
    console.log(req.body.productCode)
    if(checkPermission(req.user, permission_req)){
      db.inventory.findAll({
        where: {
          //Where product code equal code snet and inventory current quantity > 0
          [Op.and]: [
            {product_code: req.body.productCode},
            {current_quantity: {[Op.gt]: 0}}
          ]
        }
      }).then( data =>{
        //console.log(data)
        res.json(data);
      }).catch( err => {
        console.log(err)
        res.status(404).json({ error: err.errors[0].message });
      })
    }else{
      res.json({
        messege: "Permission level too low"
      })
    }
  });

module.exports = router;