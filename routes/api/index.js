// Requiring our models and passport as we've configured it
require('dotenv').config();
var path = require("path")
var db = require("../../models");
var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fileSystem = require('fs')

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_KEY);

var bcrypt = require("bcryptjs");
const e = require('express');
const cli = require('cli');
const { resolve } = require('path');
const saltRounds = 10;


//Function to check user permission level agianst required level for function.
checkPermission = (user, permission_req) =>{
  if(user.permission_level >= permission_req){
    return true
  }else{
    return false
  }
}


router.post("/convert_restaurant_results_to_csv", (req, res) =>{
  let permission_req = 1;
  if(checkPermission(req.user, permission_req)){
    
  }else{
    res.json({
      messege: "Permission level too low"
    })
  }
})

//Search yelp for potential new customers
router.post("/new_customer_search_yelp", (req, res) => {
  let permission_req = 1;
  if(checkPermission(req.user, permission_req)){
    let restaurants = []
    let multiYelp = []

    //Filters yelp results 
    const removeCurrentCustomers = (getCurrentCustomers, yelpResults) => {
      let newCustomers = yelpResults.filter(restaurant => {
        let duplicate = getCurrentCustomers.find(customer => {
          console.log(customer.business_phone_number+"|"+restaurant.phone.slice(-10))
           return(customer.business_phone_number === restaurant.phone.slice(-10)?true:false)
        })
        return (duplicate ? null : restaurant)
      })
      return newCustomers
    }

    const getCurrentCustomers = () => {
      return new Promise((resolve, reject) => {
         db.customers.findAll({
           where:{
             active_customer: true
           }
         }).then( results => {
           resolve(results)
         }).catch( error => {
           reject(error)
         })
      })
    }

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
          //Adds returned result to our restaurants array
          restaurants = [...restaurants, ...response.jsonBody.businesses]
          //resolves promise with lenght of business array length (results yelp gave us max 50) and total results
          resolve({arrayLength: response.jsonBody.businesses.length, totalResults: response.jsonBody.total})
        }).catch(err => {
          reject(err)
        })
      })
    }

    Promise.all([yelpsearch(0, false, null), getCurrentCustomers()]).then( results => {
      let yelpStats = results[0]
      let currentCustomers = results[1]
      console.log(yelpStats.totalResults)
      //console.log(restaurants)
            //results should send back (returned yelp results ( 50 max), total results)
      // Run only if there are total results over 50 and if results is at max 50
      if(yelpStats.arrayLength === 50 && yelpStats.totalResults > 50){
        //Calculating total iterations for loop rounding up
        let totalIteration = Math.ceil((yelpStats.totalResults-yelpStats.arrayLength)/50);
        //for loop starting at 1 and ending at total iterations +1. 
        for ( let i = 1; i < totalIteration+1; i++){
          //pushing yelpsearch promise in multiYelp array and setting offet by 50*i
          //----This will run our promises with correct offets to return total results from yelp
          multiYelp.push(yelpsearch(50*i))
        }
        //Promise all to run all the multiYelp array promises and then send the combined restuants array to client
        Promise.all(multiYelp).then(()=>{
          let filteredRestaurants = removeCurrentCustomers(currentCustomers, restaurants)
          res.json(filteredRestaurants)
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

//Create CSV for exporting to client.
//--Issue: Cannot send the created csv file to client
//----Figure out a way to send the file itself to the client
//----Client needs a way to start the download of the file.
router.post("/create_restaurant_csv",(req, res)=>{
  const csvWriter = createCsvWriter({
    path: path.join(__dirname, '../../csv/restaurants.csv'),
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

  console.log(data)

  csvWriter
    .writeRecords(data)
    .then(()=> console.log('The CSV file was written successfully'));

  let filePath = path.join(__dirname, '../../csv/restaurants.csv');
  let stat = fileSystem.statSync(filePath);
  
  // res.set({ 'Content-Disposition': 'attachment; filename=testing.csv', 'Content-Type': 'text/csv' })
  // res.setHeader('Content-disposition', 'attachment; filename=testing.csv');
  // res.set('Content-Type':'text/csv');
  // res.status(200).send(path.join(__dirname, '../../csv/restaurants.csv'));
  res.writeHead(200, {
    'Content-Type': 'text/csv',
    'Content-Length': stat.size
  })
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
