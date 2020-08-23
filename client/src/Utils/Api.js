import axios from "axios";

export default {

    //Log in
    logIn: userData => {
        console.log("[logging in]")
        return axios.post("/api/login", userData)
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