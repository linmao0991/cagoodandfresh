import axios from "axios";

export default {

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

    //Get all products by category
    getProductsByCate: (category) =>{
        console.log(["Get Products by Category"])
        return axios.post("/api/get_products_by_category", category)
    },

    //Get inventory by product code
    //--NOTE: product code is product id
    getInventoryByProductID: (productCode) => {
        console.log("[Get Inventory of Product]")
        return axios.post("/api/get_inventory_by_product_code", productCode)
    },

    //Search help for restaurants nearby zipcode or city
    searchYelp: (searchParam) => {
        console.log("[Search Yelp]")
        return axios.post("/api/new_customer_search_yelp", searchParam)
    },

    exportRestaurantCSV: (restaurants) => {
        console.log("[Create New Restaruant CSV]")
        return axios.post("/api/create_restaurant_csv", restaurants);
    },

    downloadCSV: (csvName) =>{
        console.log("[Getting CSV "+csvName+"]")
        return axios.get("/api/download_csv/"+csvName)
    },

    filterSearchResults: (data) => {
        console.log("[Filter Search Results]")
        return axios.post("/api/filter_restaurant_search", data)
    },

    searchInventoryByInput: (input) => {
        console.log("[Filter Search Results]")
        return axios.post("/api/search_inventory_by_input", input)
    },

    submitOrder: (orderData) => {
        console.log('[Submit Order]')
        return axios.post('/api/submit_order', orderData)
    }
}