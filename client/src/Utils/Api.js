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
        return axios.get("/api/user_data")
    },

    //Get customer information
    getCustomerInfo: customerData => {
        console.log("[Get Customer Data]")
        return axios.post("/api/find_customer", customerData);
    }
}