import axios from "axios";

const Api = {
    //Log in
    logIn: userData => {
        console.log("[Logging In]")
        return axios.post("/api/login", userData)
    },
    logOut: () => {
        console.log("[Logging Out]")
        return axios.get("/api/logout")
    },
    //Authorization
    createrUser: userData => {
        console.log("[Create User]");
        return axios.post("/api/create_employee", userData)
    },
    //Test User info
    userInfo: () => {
        console.log("[Get User Info]")
        return axios.get("/api/user_data")
    },
    //Get customer information
    getCustomerInfo: customerData => {
        console.log("[Get Customer Data]")
        return axios.post("/api/find_customer", customerData);
    },
    //Get Product Categories
    getProductCate: () => {
        console.log("[Get Categories]")
        return axios.get("/api/get_product_categories")
    },
    //Get all products
    getAllProducts: () => {
        console.log("[Get All Products")
        return axios.get("/api/get_all_products")
    },
    //Get all products by category
    getProductsByCate: (data) =>{
        console.log(["Get Products by Category"])
        return axios.post("/api/get_products_by_category", data)
    },
    //Get inventory by product code
    //--NOTE: product code is product id
    getInventoryByProductID: (productCode) => {
        console.log("[Get Inventory of Product]")
        return axios.post("/api/get_inventory_by_product_code", productCode)
    },
    //Get all suppliers
    getAllSuppliers: () => {
        console.log('[Get All Suppliers]')
        return axios.get('/api/get_all_suppliers')
    },
    getSuppliersByInput: (data) => {
        console.log(`[Get Suppliers by Input: ${data.searchString}]`)
        return axios.post('/api/get_suppliers_by_input', data)
    },
    //Get product suppliers
    getProductSuppliers: (data) => {
        console.log('[Get Product Suppliers]')
        return axios.post('/api/get_product_suppliers', data)
    },
    //Update inventory record
    updateInventory: (data) => {
        console.log("[Update Inventory Record]")
        return axios.post('/api/update_inventory', data)
    },
    //Add inventory invoice and inventory records
    addInventoryInvoice: data => {
        console.log("[Add AP Inventory Invoice]")
        return axios.post('/api/add_ap_invoice', data)
    },
    //Update product record
    updateProduct: data => {
        console.log("[Update Product Record]")
        return axios.post('/api/update_product', data)  
    },
    //Search help for restaurants nearby zipcode or city
    searchYelp: (searchParam) => {
        console.log("[Search Yelp]")
        return axios.post("/api/new_customer_search_yelp", searchParam)
    },
    //Exports restaurant search as a csv
    exportRestaurantCSV: (restaurants) => {
        console.log("[Create New Restaruant CSV]")
        return axios.post("/api/create_restaurant_csv", restaurants);
    },
    //Download exported csv
    downloadCSV: (csvName) =>{
        console.log("[Getting CSV "+csvName+"]")
        return axios.get("/api/download_csv/"+csvName)
    },
    //Filter out current customers from yelp search results
    filterSearchResults: (data) => {
        console.log("[Filter Search Results]")
        return axios.post("/api/filter_restaurant_search", data)
    },
    //Search inventory by input
    searchInventoryByInput: (input) => {
        console.log("[Filter Search Results]")
        return axios.post("/api/search_inventory_by_input", input)
    },
    //Submit order
    submitOrder: (orderData) => {
        console.log('[Submit Order]')
        return axios.post('/api/submit_order', orderData)
    }
}

export default Api