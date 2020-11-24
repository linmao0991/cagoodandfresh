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
const { error } = require('cli');
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
    console.log("User Unauthorized")
    console.log("User: "+req.user.id)
    res.status(401).json({ error: "User Unauthorized"});
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
      {id: 'zip_code', title: 'Zip'},
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
      zip_code: restaurant.location.zip_code,
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
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
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
                //Find data that starts with search property input
                [Op.startsWith]: req.body[property],
                //Find data that contains search property input
                [Op.like]: "%"+req.body[property]+"%"}
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
        console.log(err)
        res.status(404).json({ error: err.errors[0].message });
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
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
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  });

  //Update Inventory record
  router.post("/update_inventory", (req, res) => {
    let permission_req = 2;

    if(checkPermission(req.user, permission_req)){
      db.inventory.update(
        req.body.updates,
        {
          where: {
            id: req.body.id
          }
        }
      ).then( result => {
        res.json(result)
      }).catch(err => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

  router.post('/update_product', (req, res) => {
    let permission_req = 2;

    if(checkPermission(req.user, permission_req)){
      db.products.update(
        req.body.update,
        {
          where: {
            id: req.body.id
          }
        }
      ).then( result => {
        db.sequelize.query(
          `SELECT	products.id,
                  products.upc,
                  products.location,
                  products.category,
                  products.holding,
                  products.image,
                  products.measurement_system,
                  products.name_chinese,
                  products.name_english,
                  products.supplier_primary_id,
                  products.supplier_secondary_id,
                  products.supplier_tertiary_id,
                  products.weight,
                  products.description,
                  IFNULL(inventory.total_quantity - transaction.total_quantity,0) AS inventory_count
          FROM products
          LEFT JOIN (
            SELECT product_code,
                   SUM(quantity) AS total_quantity
            FROM inventory_transaction
            GROUP BY product_code
          ) transaction ON transaction.product_code = products.id
          LEFT JOIN (
            SELECT product_code,
                   SUM(invoice_quantity) as total_quantity
            FROM inventory
            GROUP BY product_code
          ) inventory ON inventory.product_code = products.id
          WHERE products.id = ${req.body.id}`,{type: db.sequelize.QueryTypes.SELECT}
        ).then( result => {
          res.json(result)
        })
      }).catch(err => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

  //Get all products
  router.get("/get_all_products", (req, res) => {
    let permission_req = 1;

    if (checkPermission(req.user, permission_req)){
      db.sequelize.query(
        `SELECT	products.id,
                products.upc,
                products.location,
                products.category,
                products.holding,
                products.image,
                products.measurement_system,
                products.name_chinese,
                products.name_english,
                products.supplier_primary_id,
                products.supplier_secondary_id,
                products.supplier_tertiary_id,
                products.weight,
                products.description,
                IFNULL(inventory.total_quantity - transaction.total_quantity,0) AS inventory_count
        FROM products
        LEFT JOIN (
          SELECT product_code,
                 SUM(quantity) AS total_quantity
          FROM inventory_transaction
          GROUP BY product_code
        ) transaction ON transaction.product_code = products.id
        LEFT JOIN (
          SELECT product_code,
                 SUM(invoice_quantity) as total_quantity
          FROM inventory
          GROUP BY product_code
        ) inventory ON inventory.product_code = products.id
        GROUP BY products.id
        ORDER BY holding DESC;`,{type: db.sequelize.QueryTypes.SELECT}
      ).then( data => {
        res.json(data)
      }).catch( err => {
        console.log(err)
        res.status(404).json({ error: err});
      })

    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

  //Get all products by category
  router.post("/get_products_by_category", (req, res) =>{
    let permission_req = 1;
    if (checkPermission(req.user, permission_req)){

      //Raw sql query
      //-Select product table columns
      //-Sum inventory table at current_quantity columns by product code
      //-Left join tables
      //-Where product table column category = category string sent by client
      //-Group results by product id
      db.sequelize.query(
        `SELECT	products.id,
                products.upc,
                products.location,
                products.category,
                products.holding,
                products.image,
                products.measurement_system,
                products.name_chinese,
                products.name_english,
                products.supplier_primary_id,
                products.supplier_secondary_id,
                products.supplier_tertiary_id,
                products.weight,
                products.description,
                IFNULL(inventory.total_quantity - transaction.total_quantity,0) AS inventory_count
        FROM products
        LEFT JOIN (
          SELECT product_code,
                 SUM(quantity) AS total_quantity
          FROM inventory_transaction
          GROUP BY product_code
        ) transaction ON transaction.product_code = products.id
        LEFT JOIN (
          SELECT product_code,
                 SUM(invoice_quantity) as total_quantity
          FROM inventory
          GROUP BY product_code
        ) inventory ON inventory.product_code = products.id
        WHERE products.${req.body.searchType} = '${req.body.searchData}'
        GROUP BY products.id
        ORDER BY holding DESC;`
        ,{type: db.sequelize.QueryTypes.SELECT}
      ).then(data => {
        res.json(data)
      }).catch((err) => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  });

  //Search inventory by search input
  router.post("/search_inventory_by_input", (req, res) => {
    let permission_req = 1;
    if(checkPermission(req.user, permission_req)){
      db.sequelize.query(
        `SELECT	products.id,
                products.upc,
                products.location,
                products.category,
                products.holding,
                products.image,
                products.measurement_system,
                products.name_chinese,
                products.name_english,
                products.supplier_primary_id,
                products.supplier_secondary_id,
                products.supplier_tertiary_id,
                products.weight,
                products.description,
                IFNULL(inventory.total_quantity - transaction.total_quantity,0) AS inventory_count
        FROM products
        LEFT JOIN (
          SELECT product_code,
                 SUM(quantity) AS total_quantity
          FROM inventory_transaction
          GROUP BY product_code
        ) transaction ON transaction.product_code = products.id
        LEFT JOIN (
          SELECT product_code,
                 SUM(invoice_quantity) as total_quantity
          FROM inventory
          GROUP BY product_code
        ) inventory ON inventory.product_code = products.id
        WHERE products.id LIKE '%${req.body.searchInput}&'
        OR products.name_english LIKE '%${req.body.searchInput}%'
        OR products.name_chinese LIKE '%${req.body.searchInput}%'
        GROUP BY products.id;`,{type: db.sequelize.QueryTypes.SELECT}
      ).then( result => {
        res.json(result)
      }).catch( err => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

  router.post('/get_product_suppliers', (req, res) => {
    let permission_req = 1

    if(checkPermission(req.user, permission_req)){

    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

  //Get inventory by product code (product id)
  router.post("/get_inventory_by_product_code",(req, res) => {
    let permission_req = 1
    //console.log(req.body.productCode)
    if(checkPermission(req.user, permission_req)){
      db.inventory.findAll({
        where: {
          product_code: req.body.productCode
        },
        include: {
          model: db.inventory_transaction,
          as: 'inventory_transactions',
        }
      }).then( results =>{
        let newResults = results.reduce((accumulator, currentValue) => {
          //console.log(currentValue)
          //Set current quantity to invoice_quantity
          let currentQuantity = currentValue.invoice_quantity
          //-Sum of all the quantities in inventory transactions array in current index if array length is larger than 0
          if(currentValue.inventory_transactions.length > 0){
            //Sum all transaction quantities in inventory_transactions to get total product already sold
            let transactions_quantity = currentValue.inventory_transactions.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.quantity), 0)
            //Current quantity is invoice quanitity minus total product quantity already sold
            currentQuantity = (currentValue.invoice_quantity - transactions_quantity).toFixed(2)
          }
          //Create new inventory object with current quantity
          let newInventory = {current_quantity: currentQuantity,...currentValue.dataValues}
          //console.log(newInventory);
          //If there are more than 0 current quantity, then push into accumulator or If req.body.allInventory is true, include 0 current quantities
          if( currentQuantity > 0 || req.body.allInventory === true){
            accumulator.push(newInventory)
          }

          return accumulator
        },[])
        //Send new inventory with current quantities to client
        res.json(newResults);
      }).catch( err => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  });

  //Order Submission
  router.post('/submit_order', (req,res)=>{
    let permission_req = 1

    //Promise to create transaction record in inventory_transaction table
    const inventoryTransaction = (invoiceNumber, data) => {
      return new Promise((reslove, reject) => {
        db.inventory_transaction.create({
          ar_invoice_number: invoiceNumber,
          inventory_id: data.inventory_id,
          product_code: data.product_code,
          product_name_english: data.name_english,
          product_name_chinese: data.name_chinese,
          upc: data.upc,
          quantity: data.quantity,
          measurement_system: data.measurement_system,
          weight: data.weight,
          sale_price: data.sale_price,
          cost: data.cost,
          transaction_type: data.transaction_type,
          location: data.location
        }).then( result => {
          reslove(result)
        }).catch( err => {
          reject(err)
        })
      })
    }

    //Promise to record payment in collections table
    const recordPayment = async (invoice) => {
      return new Promise((reslove, reject) => {
        //Checks for payment type of check by looking for check number, then settng checkBoolean based on if check number is true or false
        let checkBoolean = () => {
          return (req.body.orderData.paymentInfo.checkNumber? true: false)
        }
        //Calcualtes change from payment and total sales sets to change.
        let change = () => {
          return( (req.body.orderData.paymentInfo.paymentAmount >= req.body.orderData.cartTotalSale)?
            req.body.orderData.paymentInfo.paymentAmount - req.body.orderData.cartTotalSale:0)
        }
        //Create transaction record
        db.collections.create({
          date: req.body.orderData.orderDate,
          collection_amount: req.body.orderData.paymentInfo.paymentAmount,
          invoice_total: req.body.orderData.cartTotalSale,
          check: (req.body.orderData.paymentInfo.paymentType === "Check"? true: false),
          cash: (req.body.orderData.paymentInfo.paymentType === "Cash"? true: false),
          check_number: req.body.orderData.paymentInfo.checkNumber,
          check_memo: null,
          change: change(),
          note: null,
          employee_id: req.user.id,
          ar_invoice_number: invoice.invoice_number, 
        }).then( dbCollection => {
          //console.log(dbCollection)
          reslove(dbCollection)
        }).catch(err => {
          reject(err)
        })
      })
    }

    //Function to get invoice and all assoicated tables.
    const getCompletedOrder = (invoice) => {
      db.accounts_receivable_invoices.findOne({
        where: {
          invoice_number: invoice.invoice_number
        },
        include:[
          {model: db.inventory_transaction},
          {model: db.collections}
        ]
      }).then( result => {
        res.json(result)
      }).catch( err => {
        console.log(err)
        res.status(404).json({ error: err});
      })
    }

    if(checkPermission(req.user, permission_req)){
      //Creates new accounts receivable invoice record
      db.accounts_receivable_invoices.create({
        customer_account_number: req.body.orderData.customerData.customer_account_number,
        order_date: req.body.orderData.orderDate,
        //delivery_date: req.body,
        //pickup_date: req.body,
        invoice_total: req.body.orderData.cartTotalSale,
        employee_id: req.user.id,
        payment_status: req.body.orderData.paymentStatus
      }).then( dbInvoice => {
      //Create inventory transactions
        
        // transactionsData will hold array of inventoryTransaction promises passing in each transaction
        let transactionData = req.body.orderData.cartData.map(transaction => {
          return inventoryTransaction(dbInvoice.invoice_number, transaction)
        })

        //Promise all using the array transactionData to create each transaction records asynchronously  
        Promise.all(transactionData).then( dbTransactions => {
          //If function to record payment if there was a payment, otherwise run function getCompletedOrder function to get
          //invoice data and send back to client
          if(["Paid","Partial"].indexOf(req.body.orderData.paymentStatus) >= 0){
            console.log("Record Payment")
            recordPayment(dbInvoice).then( result => {
              getCompletedOrder(dbInvoice)
            })
          }else{
            getCompletedOrder(dbInvoice)
          }
        })
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

module.exports = router;