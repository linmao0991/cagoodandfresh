import React, { Component } from "react";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
//import MainDirectory from "./DirectoryPages/MainDirectory";
import AccountsPay from "./DirectoryPages/AccountsPay";
import AccountsRec from "./DirectoryPages/AccountsRec";
import AdminTools from "./DirectoryPages/AdminTools";
import Customers from "./DirectoryPages/Customers";
import Inventory from "./DirectoryPages/Inventory";
import OrderForm from "./DirectoryPages/OrderForm";
import OrderContext from "../Context/OrderContext";

class Directory extends Component{
    state = {
        orderCustomerData: undefined,
        orderData: undefined,
        productCate: undefined
    }
    static contextType = DirectoryContext;

    orderContextStoreHandler = (customerData, orderData) =>{
        console.log("=============================")
        console.log("Store Order Context")
        console.log(customerData)
        console.log(orderData)
        console.log("=============================")
        this.setState({
            orderCustomerData: customerData,
            orderData: orderData
        })
    }

    directoryDisplay = () =>{
        switch (this.context.currentDir) {
            case "main":
                return (null);
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
                return (
                    <OrderContext.Provider
                        value={{
                            selectedCustomerData: this.state.orderCustomerData,
                            orderCartData: this.state.orderData,
                            productCate: this.state.productCate,
                            orderContextStore: this.orderContextStoreHandler
                        }}
                    >
                        <OrderForm />
                    </OrderContext.Provider>
                );
            default:
                return (null);
        }
    }

    render(){
        return(
            <Container fluid>
                <Row>
                    <Col xs={1}>
                        <h2>Menu</h2>
                        <LoginContext.Consumer>
                            {login => (
                                <>
                                    {login.permissionLevel >= 1?
                                        <>
                                        <Button active block onClick={() => this.context.switchDir("orderform")}>Order Form</Button>
                                        <br />
                                        <Button active block onClick={() => this.context.switchDir("inventory")}>Inventory</Button>
                                        <br />
                                        <Button active block onClick={() => this.context.switchDir("customers")}>Customers</Button>
                                        <br />
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=2?
                                        <>
                                        <Button active block onClick={() => this.context.switchDir("accountsrec")}>Accounts Recieveable</Button>
                                        <br />
                                        <Button active block onClick={() => this.context.switchDir("accountspay")}>Accounts Payable</Button>
                                        <br />
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=3?
                                        <Button active block onClick={() => this.context.switchDir("admintools")}>Admin Tools</Button>
                                    :
                                    null}
                                </>
                            )}
                        </LoginContext.Consumer>
                    </Col>
                    <Col>
                        {this.directoryDisplay()}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Directory