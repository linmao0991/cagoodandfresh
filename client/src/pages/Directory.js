import React, { Component } from "react";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
import AccountsPay from "./DirectoryPages/AccountsPay";
import AccountsRec from "./DirectoryPages/AccountsRec";
import AdminTools from "./DirectoryPages/AdminTools";
import Customers from "./DirectoryPages/Customers";
import Inventory from "./DirectoryPages/Inventory";
import OrderForm from "./DirectoryPages/OrderForm";
import OrderContext from "../Context/OrderContext";
import Api from "../Utils/Api"

class Directory extends Component{
    state = {
        orderCustomerData: undefined,
        productCate: undefined,
        categoryData: undefined,
        cartData: [],
        categorySelection: undefined,
        searchType: undefined,
        productData: undefined,
        cartTotalSales: undefined,
    }
    static contextType = DirectoryContext;

    componentDidMount(){
        this.getProductCate();
    }

    //Store selected customer data to the OrderContext
    orderContextCustStore = (customerData) =>{
        this.setState({
            orderCustomerData: customerData,
        })
    }

    //Store Category data to the OrderContext
    orderContextCateStore = (categoryData) => {
        this.setState({categoryData: categoryData})
    }

    //Store CART DATA to the OrderContext
    orderContextCartStore = (cartData) => {
        this.setState({cartData: cartData})
    }

    getProductCate = () => {
        Api.getProductCate().then(res => {
            this.setState({productCate: res.data});
            //console.log(this.state.productCate)
        }).catch(err => {
            console.log("Something went wrong in getProductCate api call")
        })
    }

    //Stores the selected category to be stored into OrderContext.
    //--Called from ProductSelection.js
    orderContextCateSelStore  = (category, productData,searchType) => {
        // console.log("[Directory - orderContextCateSelStore]")
        // console.log(category)
        // console.log(productData)
        // console.log(searchType)
        this.setState({
            categorySelection: category,
            productData: productData,
            searchType: searchType
        })
    }

    orderContextCartTotalSales = sales => {
        this.setState({cartTotalSales: sales})
    }

    orderContextSearchStore = type => {
        this.setState({searchType: type})
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
                return (
                    <OrderContext.Provider
                        value={{
                            selectedCustomerData: this.state.orderCustomerData,
                            cartData: this.state.cartData,
                            productCate: this.state.productCate,
                            categorySelection: this.state.categorySelection,
                            searchType: this.state.searchType,
                            productData: this.state.productData,
                            cartTotalSales: this.state.cartTotalSales,
                            storeCartTotalSales: this.orderContextCartTotalSales,
                            storeCustomer: this.orderContextCustStore,
                            storeCategory: this.orderContextCateStore,
                            storeCart: this.orderContextCartStore,
                            storeCategorySelection: this.orderContextCateSelStore,
                            storeSearchType: this.orderContextSearchStore,
                        }}
                    >
                        <Inventory />
                    </OrderContext.Provider>
                );
            case "orderform":
                return (
                    <OrderContext.Provider
                        value={{
                            selectedCustomerData: this.state.orderCustomerData,
                            cartData: this.state.cartData,
                            productCate: this.state.productCate,
                            categorySelection: this.state.categorySelection,
                            searchType: this.state.searchType,
                            productData: this.state.productData,
                            cartTotalSales: this.state.cartTotalSales,
                            storeCartTotalSales: this.orderContextCartTotalSales,
                            storeCustomer: this.orderContextCustStore,
                            storeCategory: this.orderContextCateStore,
                            storeCart: this.orderContextCartStore,
                            storeCategorySelection: this.orderContextCateSelStore,
                            storeSearchType: this.orderContextSearchStore,
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
                <br />
                <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                        <LoginContext.Consumer>
                            {login => (
                                <>
                                    {login.permissionLevel >= 1?
                                        <>
                                        <Button onClick={() => this.context.switchDir("orderform")}>Order Form</Button>{" "}
                                        <Button onClick={() => this.context.switchDir("inventory")}>Inventory</Button>{" "}
                                        <Button onClick={() => this.context.switchDir("customers")}>Customers</Button>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=2?
                                        <>
                                        <Button onClick={() => this.context.switchDir("accountsrec")}>Accounts Recieveable</Button>{" "}
                                        <Button onClick={() => this.context.switchDir("accountspay")}>Accounts Payable</Button>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=3?
                                    <>
                                        <Button onClick={() => this.context.switchDir("admintools")}>Admin Tools</Button>{" "}
                                    </>
                                    :
                                    null}
                                </>
                            )}
                        </LoginContext.Consumer>
                    </Col>
                    <Col xs={3}>
                        <Button variant="danger" onClick={() => this.props.logoutHandler()}>Log Out</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.directoryDisplay()}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Directory