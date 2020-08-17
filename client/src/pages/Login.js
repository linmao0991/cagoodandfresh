import React, {useContext} from "react";
import LoginContext from "../Context/LoginContext";

function Login(){
    const loginContext = useContext(LoginContext);

    return(
        <div>
            <h1>Log In</h1>
            <p>Username</p>
            <input></input>
            <p>Password</p>
            <input></input>
            <br />
            <button onClick={loginContext.login}>Log In</button>
        </div>
    );
}

export default Login;