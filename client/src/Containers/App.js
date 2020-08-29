import React, { Component } from "react";
import Login from "../Pages/Login";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
import Directory from "../Pages/Directory";
import Api from "../Utils/Api";
import {Container, Row, Col, Button} from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
      permissionLevel: null,
      currentDir: "main",
      previousDir: "main"
    }
  }

  //Login context

  componentDidMount() {
    //Check for log in
    this.userAuthorized();
  }

  logoutHandler = () => {
    this.setState({
      isLoggedin: false,
      permissionLevel: null
    })
    Api.logOut().then(() => {
    })
  }
  //Function to set state of log in
  loginHandler = (user) => {
      this.setState({
        isLoggedin: true,
        permissionLevel: user.data.permission_level});
  };

  //Function to check server for log in
  userAuthorized = () =>{
    Api.userInfo({
    }).then(user => {
      this.setState({permissionLevel: user.data.permission_level})
      this.setState({isLoggedin: true});
    }).catch(err => {
      console.log(err)
      console.log("[Not Logged in]")
    })
  }

  switchDirHandler = (page) => {
    this.setState({previousDir: this.state.currentDir});
    this.setState({currentDir: page});
  }

  render () {
    console.log("[APP Render]")
    console.log(this.state)
    return (
        <LoginContext.Provider
          value = {{
            isLoggedin: this.state.isLoggedin,
            permissionLevel: this.state.permissionLevel,
            login: this.loginHandler
          }}
        >
          {this.state.isLoggedin?
            <DirectoryContext.Provider
              value = {{
                currentDir: this.state.currentDir,
                previousDir: this.state.previousDir,
                switchDir: this.switchDirHandler
              }}
            >
              <Container>
                <Row>
                  <Col>
                   {/* {this.state.currentDir === "main"? 
                    null
                    :
                    <Button onClick={() => this.switchDirHandler(this.state.previousDir)}>Back</Button>
                    } */}
                  </Col>
                  <Col>
                  </Col>
                  <Col>
                    <Button style={{float: "right"}} onClick = {() => this.logoutHandler()}>Log Out</Button>
                  </Col>
                </Row>
              </Container>
              <Directory/>
            </DirectoryContext.Provider>
            : 
            <Login/>}
        </LoginContext.Provider>
    );
  };
};

export default App;
