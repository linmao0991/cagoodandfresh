import React, {useState, useContext} from "react";
import LoginContext from "../Context/LoginContext";
import Api from "../Utils/Api"

function Login(){
    const loginContext = useContext(LoginContext);
    const [email, emailNameInput] = useState("");
    const [password, passwordInput] = useState("");

    const logUserIn = event => {
        event.preventDefault();
        console.log("username: " + email);
        console.log("password: " + password)
        //API Call to log in using userName & password
        //--Code Here
        Api.logIn({
            email: email,
            password: password
          }).then(res => {
              console.log("Success")
              emailNameInput("")
              passwordInput("")
              console.log(res.user)
            //loginContext.login;
          }).catch( err => {
            console.log("Something went wrong")
          })
    };

    const userCreate = event => {
        event.preventDefault();
        Api.createrUser({
            email: email,
            password: password
        }).then(res => {
            console.log("success")
        }).catch(err => {
            console.log("Something went wrong");
        })
    }

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
                <button onClick={logUserIn}>Log In</button>
                <button onClick={userCreate}>Create</button>
            </form>
        </div>
    );
}

export default Login;