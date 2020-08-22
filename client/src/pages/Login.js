import React, {useState, useContext} from "react";
import LoginContext from "../Context/LoginContext";
import Api from "../Utils/Api"

function Login(){
    const loginContext = useContext(LoginContext);
    const [email, emailNameInput] = useState("");
    const [password, passwordInput] = useState("");

    const logUserIn = event => {
        event.preventDefault();
        //API Call to log in using userName & password
        Api.logIn({
            email: email,
            password: password
          }).then(() => {
              console.log("[Successul log in]")
              emailNameInput("")
              passwordInput("")
              loginContext.login();
            //loginContext.login;
          }).catch( err => {
            console.log("[Unsuccessul log in]")
            console.log(err);
          })
    };

    //Working function, move this to an admin page
    // const userCreate = event => {
    //     event.preventDefault();
    //     Api.createrUser({
    //         email: email,
    //         password: password
    //     }).then(res => {
    //         console.log("success")
    //         console.log(res.data)
    //     }).catch(err => {
    //         console.log("Something went wrong");
    //         console.log(err)
    //     })
    // }

    //Working function, move this to an admin page
    // const getUserData = event =>{
    //     event.preventDefault()
    //     Api.userInfo({

    //     }).then( res =>{
    //         console.log(["[Get User Data - Success"])
    //         console.log(res.data)
    //     }).catch(err => {
    //         console.log(["[Get User Data - Failed"])
    //         console.log(err)
    //     })
    // }

    return(
        <div>
            <form>
                <h1>Log In</h1>
                <p>Email</p>
                <input
                    value = {email}
                    type = "email"
                    autoComplete= "email"
                    onChange = {event => emailNameInput(event.target.value)}
                    className="form-control validate"
                />
                <p>Password</p>
                <input
                    value = {password}
                    type = "password"
                    autoComplete= "current-password"
                    onChange = {event => passwordInput(event.target.value)}
                    className="form-control validate"
                />
                <br />
                <button onClick={event => logUserIn(event)}>Log In</button>
            </form>
        </div>
    );
}

export default Login;