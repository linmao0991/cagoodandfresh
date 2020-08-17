import React, { Component } from "react";
import LoginContext from "../Context/LoginContext";

class Directory extends Component{
    static contextType = LoginContext;

    render(){
        console.log(this.context.isLoggedin)
        return(
            <div>
                <h1>Directory</h1>
                <h2>Order Form</h2>
                <h2>Inventory</h2>
                <h2>Customers</h2>
                <h2>Accounts Recieveable</h2>
                <h2>Accounts Payable</h2>
            </div>
        )
    }
}

export default Directory