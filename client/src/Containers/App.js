import React, { Component } from "react";
import Login from "../Pages/Login";
import LoginContext from "../Context/LoginContext"
import Directory from "../Pages/Directory";
import Api from "../Utils/Api";

class App extends Component {
  state = {
    isLoggedin: false
  };

  static contextType = LoginContext

  loginHandler = (email, password) => {
      this.setState({isLoggedin: true});
  };

  render () {
    return (
      <div>
        <LoginContext.Provider
          value = {{
            isLoggedin: this.state.isLoggedin,
            login: this.loginHandler
          }}
        >
          {this.state.isLoggedin? <Directory/> : <Login/>}
        </LoginContext.Provider>
      </div>
    );
  };
};

export default App;
