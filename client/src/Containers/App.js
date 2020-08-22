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

  componentDidMount() {
    this.userAuthorized();
  }

  loginHandler = () => {
      this.setState({isLoggedin: true});
  };

  userAuthorized = () =>{
    Api.userInfo({

    }).then(() => {
      this.loginHandler()
    }).catch(err => {
      console.log(err)
      console.log("[Not Logged in]")
    })
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
          {this.state.isLoggedin? <Directory/> : <Login/>}
        </LoginContext.Provider>
      </div>
    );
  };
};

export default App;
