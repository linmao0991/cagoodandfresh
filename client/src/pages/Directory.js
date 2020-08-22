import React, { Component } from "react";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
import MainDirectory from "./DirectoryPages/MainDirectory";
import AccountsPay from "./DirectoryPages/AccountsPay";
import AccountsRec from "./DirectoryPages/AccountsRec";
import AdminTools from "./DirectoryPages/AdminTools";
import Customers from "./DirectoryPages/Customers";
import Inventory from "./DirectoryPages/Inventory";
import OrderForm from "./DirectoryPages/OrderForm";

class Directory extends Component{
    state = {

    }
    static contextType = DirectoryContext;

    directoryDisplay = () =>{
        switch (this.context.currentDir) {
            case "main":
                return (<MainDirectory />);
            case "accountspay":
                return (<AccountsPay />);
            case "accountsrec":
                return (<AccountsRec />);
            case "admintools":
                return (<AdminTools />);
            case "customers":
                return (<Customers />);
            case "inventory":
                return (<Inventory />);
            case "orderform":
                return (<OrderForm />);
            default:
                return (<MainDirectory />);
        }
    }

    render(){
        console.log(this.context)
        return(
            this.directoryDisplay()
        )
    }
}

export default Directory