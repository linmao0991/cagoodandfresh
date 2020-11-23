import React, {useState, useContext} from "react";
import LoginContext from "../context/LoginContext";
import Api from "../utils/Api";
import {Button, Container, Row, Col} from "react-bootstrap";

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
          }).then(user => {
              console.log("[Successul log in]")
              emailNameInput("")
              passwordInput("")
              loginContext.login(user);
          }).catch( err => {
            console.log("[Unsuccessul log in]")
            console.log(err);
          })
    };

    return(
        <Container>
            <Row>
                <Col></Col>
                <Col>
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
                        <br />
                        <p>Password</p>
                        <input
                            value = {password}
                            type = "password"
                            autoComplete= "current-password"
                            onChange = {event => passwordInput(event.target.value)}
                            className="form-control validate"
                        />
                    </form>
                    <br />
                    <Button onClick={event => logUserIn(event)}>Log In</Button>
                    {/* <br />
                    <Button onClick={event => userCreate(event)}>Create User</Button>
                    <br />
                    <Button onClick={event => getUserData(event)}>Get User Data</Button> */}
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default Login;