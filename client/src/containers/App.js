import React, { Component } from "react";
import Login from "../pages/Login";
import LoginContext from "../context/LoginContext";
import DirectoryContext from "../context/DirectoryContext";
import Directory from "../pages/Directory";
import Api from "../utils/Api";

class App extends Component {
  state = {
    isLoggedin: false,
    permissionLevel: null,
    currentDir: '',
    previousDir: '',
  }

  //Login context

  componentDidMount() {
    //Check for log in
    this.userAuthorized();
  }

  logoutHandler = () => {
    this.setState({
      isLoggedin: false,
      permissionLevel: null,
      currentDir: 'main',
      previousDir: 'main'
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
      console.log("[Not Logged in]")
    })
  }

  switchDirHandler = (page) => {
    this.setState({previousDir: this.state.currentDir});
    this.setState({currentDir: page});
  }

  render () {
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
              <Directory
                logoutHandler = {this.logoutHandler}
                permission_level = {this.state.permissionLevel}
              />
            </DirectoryContext.Provider>
            : 
            <Login/>}
        </LoginContext.Provider>
    );
  };
};

export default App;
