import axios from "axios";

export default {

    //Log in
    logIn: userData => {
        console.log("logging in")
        return axios.post("/api/login", userData)
    },

    //Authorization
    createrUser: userData => {
        console.log("Create User");
        return axios.post("/api/create_employee", userData)
    },

    //Test User info
    userInfo: () => {
        console.log("[ Get User Data]")
        return axios.get("/api/user_data")
    }
}