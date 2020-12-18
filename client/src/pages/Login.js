import React, {useState, useContext} from "react";
import LoginContext from "../context/LoginContext";
import Api from "../utils/Api";
import {Button, Container, Row, Col,Spinner, Alert} from "react-bootstrap";

const Login = () =>{
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
    const [loginFailed, setloginFailed] = useState({type: null, mess: null})

    const handleCollapse = elId => {
        let elem = document.getElementById(elId)
        // if(elem.style.maxHeight !== '0px'){
        //     elem.style.maxHeight = '0px'
        // }else{
            elem.style.maxHeight = elem.scrollHeight+'px'
            elem.style.opacity = '1'       
    }

    const checkInputs = () => {
        let inputValues = ["password","email"]
        let checkInputValues = [];
        inputValues.forEach(inputValue => {
            if(document.getElementById(inputValue).value === undefined
            || document.getElementById(inputValue).value === null
            || document.getElementById(inputValue).value === ''){
                document.getElementById(inputValue).style.borderColor = 'red';
                document.getElementById(inputValue).style.borderStyle = 'solid';
                document.getElementById(inputValue).style.borderWidth = '2px';
                checkInputValues.push(false)
            }else{
                document.getElementById(inputValue).style.removeProperty('border-color')
                document.getElementById(inputValue).style.removeProperty('border-style')
                document.getElementById(inputValue).style.removeProperty('border-width')
            }
        })
        return checkInputValues.every(value => {return value? true: false})
    }

    const signUp = () => {
        setLoggingIn(true)
        console.log(checkInputs())
        if(checkInputs()){
            Api.createrUser({
                email: email,
                password: password
            }).then( response => {
                emailNameInput('')
                passwordInput('')
                loginContext.login(response);
            }).catch( err => {
                console.log(err.response.data.error)
                console.log("[Sign Up Failed]")
                setloginFailed({type: 'Sign Up Failed', mess: err.response.data.error})
                handleCollapse('failed-login')
                setLoggingIn(false)
            })
        }else{
            console.log("[Sign Up Failed]")
            setloginFailed({type:'Sign Up Failed', mess: 'Email or Password empty'})
            handleCollapse('failed-login')
            setLoggingIn(false) 
        }
    }

    const handlePasswordInput = input => {
        passwordInput(input)
    }

    const handleEmailInput = input => {
        emailNameInput(input)
    }

    const logUserIn = () => {
        setLoggingIn(true)
        console.log(checkInputs())
        if(checkInputs()){
            Api.logIn({
                email: email,
                password: password
            }).then(response => {
                emailNameInput('')
                passwordInput('')
                loginContext.login(response);
            }).catch( err => {
                console.log("[Login Failed]")
                console.log(err.response.data)
                if(err.response.data === 'Unauthorized'){
                    setloginFailed({type: 'Login Failed', mess: 'Email or Password is incorrect'})
                }
                if(err.response.data === 'Bad Request'){
                    setloginFailed({type: 'Login Failed', mess:'Email or Password fields are empty'})
                }
                handleCollapse('failed-login')
                setLoggingIn(false)
            })
        }else{
            console.log("[Login Failed]")
            setloginFailed({type: 'Login Failed', mess:'Email or Password fields are empty'})
            handleCollapse('failed-login')
            setLoggingIn(false) 
        }
    };

    return(
        <Container>
            <Row className='justify-content-md-center' style={{marginTop: '40px', marginBottom: '20px'}}>
                <Col md={5}>
                    <h1 style={{textAlign: 'center'}}>Log In</h1>
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col md={5} 
                    style={{
                    backgroundColor: '#2c2c2c',
                    borderRadius: '15px',
                    padding: '30px',
                    }}>
                        <div id={'failed-login'} style={collapseStyle}>
                            <Alert key={'failed-login'} variant='danger'>
                                <p style={{margin: '0px', textAlign: 'center'}}>{loginFailed.type}</p>
                                <p style={{margin: '0px', textAlign: 'center'}}>Error: {loginFailed.mess}</p>
                            </Alert>
                        </div>
                        <label>Email</label>
                        <input
                            id = 'email'
                            disabled = {loggingIn?true:false}
                            style={loggingIn?{backgroundColor: 'grey', borderColor: 'grey'}:null}
                            value = {email}
                            type = "email"
                            autoComplete= "email"
                            onChange = {event => handleEmailInput(event.target.value)}
                            className="form-control validate"
                        />
                        <br />
                        <label>Password</label>
                        <input
                            id='password'
                            disabled = {loggingIn?true:false}
                            style={loggingIn?{backgroundColor: 'grey', borderColor: 'grey'}:null}
                            value = {password}
                            type = "password"
                            autoComplete= "current-password"
                            onChange = {event => handlePasswordInput(event.target.value)}
                            className="form-control validate"
                        />
                        <br />
                        <Row>
                            <Col >
                                <Button
                                    disabled = {loggingIn?true:false}
                                    variant= {loggingIn?'secondary':'info'} 
                                    onClick= {event => logUserIn(event)}
                                    style={{ width: '75%'}}
                                >
                                    {loggingIn?
                                    <Spinner animation="border" role="status" size='sm'>
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                    :
                                    'Log In'
                                    }
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    disabled = {loggingIn?true:false}
                                    variant= {loggingIn?'secondary':'info'} 
                                    onClick= {event => signUp(event)}
                                    style={{float: 'right', width: '75%'}}
                                >
                                    {loggingIn?
                                    <Spinner animation="border" role="status" size='sm'>
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                    :
                                    'Sign Up'
                                    }
                                </Button>
                            </Col>
                        </Row>
                    {/* </div> */}
                </Col>
            </Row>
        </Container>
    );
}

export default Login;