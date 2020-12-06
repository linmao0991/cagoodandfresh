import React, {useState, useContext} from "react";
import LoginContext from "../context/LoginContext";
import Api from "../utils/Api";
import {Button, Container, Row, Col,Spinner, Alert} from "react-bootstrap";

function Login(){
    const collapseStyle = {
        width: '100%',
        maxHeight: '0px', 
        overflow: 'hidden',
        opacity: '0',
        //transition: 'max-height 0.4s ease-out', 
        transitionProperty: 'max-height, opacity',
        transitionDuration: '1s'
    }

    const loginContext = useContext(LoginContext);
    const [email, emailNameInput] = useState('');
    const [password, passwordInput] = useState('');
    const [loggingIn, setLoggingIn] = useState(false)
    const [loginFailed, setloginFailed] = useState(false)

    const handleCollapse = elId => {
        let elem = document.getElementById(elId)
        // if(elem.style.maxHeight !== '0px'){
        //     elem.style.maxHeight = '0px'
        // }else{
            elem.style.maxHeight = elem.scrollHeight+'px'
            elem.style.opacity = '1'
        
    }

    const logUserIn = event => {
        event.preventDefault();
        //API Call to log in using userName & password
        setLoggingIn(true)
        Api.logIn({
            email: email,
            password: password
          }).then(response => {
            emailNameInput(null)
            passwordInput(null)
            loginContext.login(response);
          }).catch( err => {
            console.log("[Login Failed]")
            console.log(err.response.data)
            if(err.response.data === 'Unauthorized'){
                setloginFailed('Email or Password is incorrect')
            }
            if(err.response.data === 'Bad Request'){
                setloginFailed('Email or Password fields are empty')
            }
            handleCollapse('failed-login')
            setLoggingIn(false)
          })
    };

    return(
        <Container>
            <Row className='justify-content-md-center' style={{marginTop: '40px', marginBottom: '20px'}}>
                <Col md={5}>
                    <h1 style={{textAlign: 'center'}}>Log In</h1>
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col md={5}>
                    <div 
                        style={{
                            backgroundColor: '#2c2c2c',
                            borderRadius: '15px',
                            padding: '30px',
                        }}
                    >
                        <div id={'failed-login'} style={collapseStyle}>
                            <Alert key={'failed-login'} variant='danger'>
                                <p style={{margin: '0px', textAlign: 'center'}}>Login Failed!</p>
                                <p style={{margin: '0px', textAlign: 'center'}}>{loginFailed}</p>
                            </Alert>
                        </div>
                        <label>Email</label>
                        <input
                            disabled = {loggingIn?true:false}
                            style={loggingIn?{backgroundColor: 'grey', borderColor: 'grey'}:null}
                            value = {email}
                            type = "email"
                            autoComplete= "email"
                            onChange = {event => emailNameInput(event.target.value)}
                            className="form-control validate"
                        />
                        <br />
                        <label>Password</label>
                        <input
                            disabled = {loggingIn?true:false}
                            style={loggingIn?{backgroundColor: 'grey', borderColor: 'grey'}:null}
                            value = {password}
                            type = "password"
                            autoComplete= "current-password"
                            onChange = {event => passwordInput(event.target.value)}
                            className="form-control validate"
                        />
                        <br />
                        <Button
                            disabled = {loggingIn?true:false}
                            variant= {loggingIn?'secondary':'info'} 
                            onClick= {event => logUserIn(event)}
                            style={{width: '33%'}}
                        >
                            {loggingIn?
                            <Spinner animation="border" role="status" size='sm'>
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                             :
                             'Log In'
                            }
                        </Button>
                        {/* <br />
                        <Button onClick={event => userCreate(event)}>Create User</Button>
                        <br />
                        <Button onClick={event => getUserData(event)}>Get User Data</Button> */}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;