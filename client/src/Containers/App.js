import React, { Component } from "react";
import Login from "../Pages/Login";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
import Directory from "../Pages/Directory";
import Api from "../Utils/Api";

class App extends Component {
  state = {
    isLoggedin: false,
    currentDir: "main",
    previousDir: "main"
  };

  //Login context

  componentDidMount() {
    //Check for log in
    this.userAuthorized();
  }

  //Function to set state of log in
  loginHandler = () => {
      this.setState({isLoggedin: true});
      console.log(this.state.isLoggedin);
  };

  //Function to set state of log in after logging in
  isLoggedIn = () =>{
  }

  //Function to check server for log in
  userAuthorized = () =>{
    Api.userInfo({
    }).then(() => {
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
    return (
      <div>
        <LoginContext.Provider
          value = {{
            isLoggedin: this.state.isLoggedin,
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
              <Directory/>
            </DirectoryContext.Provider>
            : 
            <Login/>}
        </LoginContext.Provider>
      </div>
    );
  };
};

export default App;
