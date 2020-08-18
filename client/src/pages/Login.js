import React, {useState, useContext} from "react";
import LoginContext from "../Context/LoginContext";


function Login(){
    const loginContext = useContext(LoginContext);
    const [userName, userNameInput] = useState("");
    const [password, passwordInput] = useState("");

    const logUserIn = () => {
        console.log("username: " + userName);
        console.log("password: " + password)
        //API Call to log in using userName & password
        //--Code Here

        //On successful log in
        //--Clear state values
        // call loginContext.login()
        loginContext.login()

        //On unsucessful log in
        //-- Clear state values
        //-- Display unsuccessful log in
    };

    return(
        <div>
            <form>
                <h1>Log In</h1>
                <p>Username</p>
                <input
                    value = {userName}
                    type = "text"
                    autoComplete= "username"
                    onChange = {event => userNameInput(event.target.value)}
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
                <button onClick={() => logUserIn()}>Log In</button>
            </form>
        </div>
    );
}

export default Login;