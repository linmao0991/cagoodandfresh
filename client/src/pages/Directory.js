import React, { Component } from "react";
import {Button, Container, Row, Col, Navbar, Nav} from "react-bootstrap";
import LoginContext from "../Context/LoginContext";
import DirectoryContext from "../Context/DirectoryContext";
import AccountsPay from "./DirectoryPages/AccountsPay";
import AccountsRec from "./DirectoryPages/AccountsRec";
import AdminTools from "./DirectoryPages/AdminTools";
import Customers from "./DirectoryPages/Customers";
import Inventory from "./DirectoryPages/Inventory";
import OrderForm from "./DirectoryPages/OrderForm";
import OrderContext from "../Context/OrderContext";
import InventoryContext from '../Context/InventoryContext';
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
        cartTotalSales: 0.00,
        paymentInfo: {
            paymentAmount: 0,
            paymentType: "Pay Type",
            checkNumber: null,
        }
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
        this.setState({
            categorySelection: category,
            productData: productData,
            searchType: searchType,
        })
    }

    orderContextCartTotalSales = sales => {
        this.setState({cartTotalSales: sales})
    }

    orderContextSearchStore = type => {
        this.setState({searchType: type})
    }

    orderContextPaymentInfo = data => {
        this.setState({paymentInfo: {...data}})
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
                    <InventoryContext.Provider
                        value = {{
                            categories: this.state.productCate,
                            permission_level: this.props.permission_level
                        }}
                    >
                        <Inventory/>
                    </InventoryContext.Provider>
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
                            paymentInfo: this.state.paymentInfo,
                            storeCartTotalSales: this.orderContextCartTotalSales,
                            storeCustomer: this.orderContextCustStore,
                            storeCategory: this.orderContextCateStore,
                            storeCart: this.orderContextCartStore,
                            storeCategorySelection: this.orderContextCateSelStore,
                            storeSearchType: this.orderContextSearchStore,
                            storePaymentInfo: this.orderContextPaymentInfo,
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
                    <Col md='auto' style={{width: '100%', display: 'flex', justifyContent: 'left', fontWeight: 'bold'}}>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{width: '100%'}}>
                        {/* <Navbar.Brand href="#home">Main Menu</Navbar.Brand> */}
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                            <LoginContext.Consumer>
                            {login => (
                                <>
                                    {login.permissionLevel >= 1?
                                        <>
                                        <Nav.Link onClick={() => this.context.switchDir("orderform")}>Order Form</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("customers")}>Customers</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=2?
                                        <>
                                        <Nav.Link onClick={() => this.context.switchDir("inventory")}>Inventory</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("accountsrec")}>Accounts Recieveable</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("accountspay")}>Accounts Payable</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=3?
                                    <>
                                        <Nav.Link onClick={() => this.context.switchDir("admintools")}>Admin Tools</Nav.Link>{" "}
                                    </>
                                    :
                                    null}
                                </>
                            )}
                            </LoginContext.Consumer>
                            </Nav>
                            <Nav>
                                <Nav.Link variant="danger" href='' stye={{float: 'right'}}onClick={() => this.props.logoutHandler()}>Log Out</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
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