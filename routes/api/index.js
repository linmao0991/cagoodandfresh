require('dotenv').config();
let path = require("path")
let db = require("../../models");
let passport = require("../../config/passport");
let router = require("express").Router();
const { Op } = require("sequelize");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_KEY);

//Global Functions
//Function to check user permission level agianst required level for function.
checkPermission = (user, permission_req) =>{
  if(user.permission_level >= permission_req){
    return true
  }else{
    return false
  }
}

recordCashLedger = data => {
  return new Promise((resolve, reject) => {
    console.log("[Record Cash Tranaction]")
    let { 
      accountTable,
      accountTableId,
      credit = 0,
      debit = 0,
      check = false,
      cash = false, 
      checkNumber = null,
      note = null,
      referenceNumber,
      referenceId,
      exmmployee_id
    } = data
    db.cash.create({
      account: accountTable,
      account_id: accountTableId,
      credit: credit,
      debit: debit,
      check: check,
      cash: cash,
      check_number: checkNumber,
      note: note,
      employee_id: exmmployee_id,
      reference: referenceNumber,
      reference_id: referenceId 
    }).then( dbCash => {
      console.log("[Cash Tranaction Recorded]")
      console.log(dbCash)
      resolve(dbCash)
    }).catch(err => {
      reject(err)
    })
  })
}

recordAccountsReceiveable = (data) => {
  return new Promise((resolve, reject) => {
    console.log("[Record AR]")
    let {
      credit = 0,
      debit = 0,
      note = null,
      invoice_number,
      invoice_id,
      exmmployee_id
    } = data

    db.accounts_receivable.create({
      credit: credit,
      debit: debit,
      note: note,
      //Reference to accounts_receivable_invoice
      reference: invoice_number,
      reference_id: invoice_id,
      employee_id: exmmployee_id,
    }).then( result => {
      console.log("[AR Recorded]")
      resolve(result)
    }).catch( err => {
      reject(err)
    })
  })
}

recordSalesRevenue = (data) => {
  return new Promise((resolve, reject) => {
    console.log("[Record Sales Revenue]")
    let {
      customer_account_number,
      credit = 0,
      debit = 0,
      note = null,
      ar_invoice_id,
      ar_invoice_number,
      exmmployee_id
    } = data
    db.sales_revenue.create({
      customer_account_number: customer_account_number,
      credit: credit,
      debit: debit,
      note: note,
      ar_invoice_number: ar_invoice_number,
      ar_invoice_id: ar_invoice_id,
      employee_id: exmmployee_id
    }).then( dbSalesRevenue => {
      console.log("[Sales Transaction Recorded]")
      resolve(dbSalesRevenue)
    }).catch( err => {
      reject(err)
    })
  })
}

//End Global Functions

//Search yelp for potential new customers
router.post("/new_customer_search_yelp", (req, res) => {
  console.log("===================================")
  console.log("[Search for Restaurants]")
  console.log("===================================")
  const permission_req = 1;
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

//Log in 2.0
router.post("/login", passport.authenticate("local"),(req, res) => {
    console.log("===================================")
    console.log("[Authentication Successful]")
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
    let disabled = true;
    console.log("===================================")
    console.log("[Create Employee]")
    console.log("===================================")
    const permission_req = 0;
    if(disabled){
      res.status(503).json({ error: 'Sign up currently unavaliable' });
    }else{
      db.employees.create({
        email: req.body.email,
        password: req.body.password,
        permission_level: req.body.permission_level? req.body.permission_level: 1 ,
        })
          .then((dbUser) => {
            req.login(dbUser, (err) => {
                if (err) {
                console.log(err);
                }
                res.json({
                  id: dbUser.id,
                  first_name: dbUser.first_name,
                  last_name: dbUser.last_name,
                  permission_level: dbUser.permission_level,
                });
            })
          })
          .catch((err) => {
          console.log(err.errors[0].message)
          res.status(401).json({ error: err.errors[0].message });
        });
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
      res.status(401).send("Please Log In")
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
  const permission_req = 1;
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
  const permission_req = 1;
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

//Add ap invoice and inventory records
router.post("/add_ap_invoice", (req,res) => {
  const recordInventory = (inventory) => {
    return new Promise((resolve, reject) => {
      db.inventory.create({
        inventory
      }).then(response => {
        resolve(response)
      }).catch( err => {
        resolve({
          error: err,
          info: {
            status: 'FAILED',
            inventory: inventory
          }})
      })
    })
  }

  let permission_level = 3
  if(checkPermission(req.user, permission_level)){
    db.accounts_payable_invoices.create(
      req.invoiceDetails).then( response => {
        let recordInvArray = req.inventoryDetials.map(invenotry => {
          return recordInventory({...inventory, ap_invoice_id: response.data.id})
        })
       Promise.all(recordInvArray).then( result => {
         res.json({
           accounts_payable_invoice: response,
           inventory_items: result
         })
       })
    }).catch( err => {
      res.json(err)
    })
  }else{
    console.log("User Unauthorized")
    console.log("User: "+req.user.id)
    res.status(401).json({ error: "User Unauthorized"});
  }
})

//Update Inventory record
router.post("/update_inventory", (req, res) => {
  const permission_req = 2;

  //Update inventory data sent from client contains field name and field value.
  //--This reduces the amount of code, instead of a switch, if, or multiple APIs for updating inventory fields  
  if(checkPermission(req.user, permission_req)){
    db.inventory.update(
      //updates structure is [fieldName]: fieldValue
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

//Update product
router.post('/update_product', (req, res) => {
  const permission_req = 2;

  //Update product information sent from client contains field name and field value.
  //--This reduces the amount of code, instead of a switch, if, or multiple APIs for updating product information
  if(checkPermission(req.user, permission_req)){
    db.products.update(
      //data from server is in the format [field]: fieldValue
      req.body.update,
      {
        where: {
          id: req.body.id
        }
      }
    ).then( result => {
      //Raw SQL query that finds all products, left join transactions and inventory, 
      // --sums up the relevant quantities for both tables then calculates current quantity
      // --as inventory_count
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
  const permission_req = 1;

  // Raw SQL query that finds all products, left join transactions and inventory, 
  // --sums up the relevant quantities for both tables then calculates current quantity
  // --as inventory_count
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
              IFNULL(inventory.total_quantity - IFNULL(transaction.total_quantity,0),0) AS inventory_count
          FROM products
          LEFT JOIN (
            SELECT product_code,
                    IFNULL(SUM(quantity),0) as total_quantity
            FROM inventory_transaction
            WHERE quantity IS NOT NULL
            GROUP BY product_code
          ) transaction ON transaction.product_code = products.id
          LEFT JOIN (
            SELECT product_code,
                    IFNULL(SUM(invoice_quantity),0) as total_quantity
            FROM inventory
            WHERE invoice_quantity IS NOT NULL
            GROUP BY product_code
          ) inventory ON inventory.product_code = products.id
          GROUP BY products.id
          ORDER BY category DESC;`,{type: db.sequelize.QueryTypes.SELECT}
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
  const permission_req = 1;
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
          IFNULL(inventory.total_quantity - IFNULL(transaction.total_quantity,0),0) AS inventory_count
          FROM products
          LEFT JOIN (
            SELECT product_code,
                    IFNULL(SUM(quantity),0) as total_quantity
            FROM inventory_transaction
            WHERE quantity IS NOT NULL
            GROUP BY product_code
          ) transaction ON transaction.product_code = products.id
          LEFT JOIN (
            SELECT product_code,
                    IFNULL(SUM(invoice_quantity),0) as total_quantity
            FROM inventory
            WHERE invoice_quantity IS NOT NULL
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
  const permission_req = 1;

  // Raw SQL query that finds all products by the search input, left join transactions and inventory, 
  // --sums up the relevant quantities for both tables then calculates current quantity
  // --as inventory_count
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
              IFNULL(inventory.total_quantity - IFNULL(transaction.total_quantity,0),0) AS inventory_count
        FROM products
        LEFT JOIN (
          SELECT product_code,
                  SUM(quantity) as total_quantity
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

//Get All suppliers
router.get('/get_all_suppliers', (req, res) => {
    const permission_req = 2
    if(checkPermission(req.user, permission_req)){
      db.suppliers.findAll({
      }).then( result => {
        res.json(result)
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

//Get suppliers by search string input
router.post('/get_suppliers_by_input', (req, res) => {
  const permission_req = 2

  if(checkPermission(req.user, permission_req)){
    //Takes in the search string converts to array spliting at spaces
    let stringArray = req.body.searchString.split(/,| /)

    //Map through stringArray and create new array to search every listed field for the array of strings
    //--The array structure is for sequelize query
    let searchArray = []
    stringArray.map(string => {
        ['name_english','name_chinese','products','id'].forEach(field => {
          if(field === 'id'){
            searchArray.push({
              [field]: string
            })
          }else{
            searchArray.push({
              [field]:{
                [Op.substring]: string
              }
            })
          }
        })
      })
    //Find all records using our searchArray
    db.suppliers.findAll({
      where: {
        [Op.or]: searchArray
      }
    }).then( result => {
      res.json(result)
    })
  }else{
    console.log("User Unauthorized")
    console.log("User: "+req.user.id)
    res.status(401).json({ error: "User Unauthorized"});
  }
})

//Get product suppliers
router.post('/get_product_suppliers', (req, res) => {
    const permission_req = 1

    //Promse function to get suppliers from DB
    const supplierSearch = (supplierId) => {
      return new Promise((resolve, reject) => {
        db.suppliers.findOne({
          where:{
            id: supplierId
          }
        }).then( response => {
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    }

    if(checkPermission(req.user, permission_req)){

      //Array to store supplierSearch promise function for each supplier ID
      //--Had to do it this way because sequelize eager loading keeps ordering results by ascending ID
      //--We need to keep suppliers in order because they are stored in tiers
      let searchArray = req.body.supplier_ids.map( supplierId => {
        return supplierSearch(supplierId)
      })

      //Promise all for the searchArray
      Promise.all(searchArray).then(result => {
        let suppliers = result
        //Checks for less than 3 suppliers
        if(result.length < 3){
          //Loop to make sure suppliers array length is 3 because database stores 3 suppliers in tiers
          //--and user must be able to see if some tiers are empty
          let x = (3 - result.length)
          for( let i = 0; i < x; i++){
            suppliers.push(null)
          }
        }
        res.json(suppliers)
      }).catch( err => {
        console.log(err)
        res.json(err)
      })
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
  })

//Get inventory by product code (product id)
router.post("/get_inventory_by_product_code",(req, res) => {
    console.log(req.body.productCode)
    const permission_req = 1
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
        console.log(results)
        let newResults = results.reduce((accumulator, currentValue) => {
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
        console.log(newResults)
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
    const permission_req = 1

    //Promise to create transaction record in inventory_transaction table
    const inventoryTransaction = (invoice, transaction) => {
      return new Promise((reslove, reject) => {
        db.inventory_transaction.create({
          ar_invoice_id: invoice.id,
          ar_invoice_number: invoice.invoice_number,
          inventory_id: transaction.inventory_id,
          product_code: transaction.product_code,
          product_name_english: transaction.name_english,
          product_name_chinese: transaction.name_chinese,
          upc: transaction.upc,
          quantity: transaction.quantity,
          measurement_system: transaction.measurement_system,
          weight: transaction.weight,
          sale_price: transaction.sale_price,
          cost: transaction.cost,
          transaction_type: transaction.transaction_type,
          location: transaction.location
        }).then( result => {
          reslove(result)
        }).catch( err => {
          reject(err)
        })
      })
    }

    //Function to get invoice and all assoicated tables.
    const getCompletedOrder = (invoice) => {
      return new Promise((resolve,reject) => {
        console.log("[Completing Order]")
        db.accounts_receivable_invoices.findOne({
          where: {
            invoice_number: invoice.invoice_number
          },
          include:[
            {model: db.inventory_transaction},
          ]
        }).then( dbInvoice => {
          resolve( dbInvoice)
        }).catch( err => {
          reject(err)
          //res.status(404).json({ error: err});
        })
      })
    }

    const createArInvoice = () => {
      return new Promise((resolve,reject) => {
        console.log("[Create AR Invoice]")
        db.accounts_receivable_invoices.create({
          customer_account_number: req.body.orderData.customerData.customer_account_number,
          order_date: req.body.orderData.orderDate,
          //delivery_date: req.body,
          //pickup_date: req.body,
          invoice_total: req.body.orderData.cartTotalSale,
          employee_id: req.user.id,
          payment_status: req.body.orderData.paymentStatus
        }).then( dbInvoice => {
          console.log("[AR Invoice Created]")
          resolve(dbInvoice)
        }).catch( err => {
          reject(err)
        })
      })
    } 

  const submitOrder = async () => {
    //Create array of promse function inventoryTransaction() for each transaction
    //Creates new accounts receivable invoice record
    let dbInvoice = await createArInvoice()

    let dbAccountsReceivable = await recordAccountsReceiveable({
      debit: dbInvoice.invoice_total,
      note: null,
      invoice_number: dbInvoice.invoice_number,
      invoice_id: dbInvoice.id,
      exmmployee_id: req.user.id
    })

    let transactionData = req.body.orderData.cartData.map(transaction => {
      return inventoryTransaction(dbInvoice, transaction)
    })
    //Promise all using the array transactionData to create each transaction records asynchronously
    await Promise.all(transactionData)
    //Wait for promise function to create a new accounts receivable record

    let dbSalesRevenueRec = await recordSalesRevenue({
      customer_account_number: dbInvoice.customer_account_number,
      credit: dbInvoice.invoice_total,
      note: null,
      ar_invoice_id: dbInvoice.id,
      ar_invoice_number: dbInvoice.invoice_number,
      exmmployee_id: req.user.id
    })

    if(req.body.orderData.paymentInfo.paymentAmount >= 0){
      console.log()
      console.log("Record Payment")
      await recordCashLedger({
        accountTable: "accounts_receivable",
        accountTableId: dbAccountsReceivable.id,
        debit: +req.body.orderData.paymentInfo.paymentAmount,
        check: req.body.orderData.paymentInfo.checkNumber? true: false,
        cash: req.body.orderData.paymentInfo.checkNumber? false: true, 
        checkNumber: req.body.orderData.paymentInfo.checkNumber? req.body.paymentInfo.checkNumber: null,
        note: null,
        referenceNumber: dbInvoice.invoice_number,
        referenceId: dbInvoice.id,
        exmmployee_id: req.user.id
      })
    }
    let completedOrder = await getCompletedOrder(dbInvoice)

    res.json(completedOrder)
  }

    if(checkPermission(req.user, permission_req)){
      submitOrder()
    }else{
      console.log("User Unauthorized")
      console.log("User: "+req.user.id)
      res.status(401).json({ error: "User Unauthorized"});
    }
})

module.exports = router;