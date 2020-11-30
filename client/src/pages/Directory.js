import React, { Component } from "react";
import {Container, Row, Col, Navbar, Nav} from "react-bootstrap";
import LoginContext from "../context/LoginContext";
import DirectoryContext from "../context/DirectoryContext";
import AccountsPay from "./DirectoryPages/AccountsPay";
import AccountsRec from "./DirectoryPages/AccountsRec";
import AdminTools from "./DirectoryPages/AdminTools";
import Customers from "./DirectoryPages/Customers";
import Inventory from "./DirectoryPages/Inventory";
import OrderForm from "./DirectoryPages/OrderForm";
import OrderContext from "../context/OrderContext";
import InventoryContext from '../context/InventoryContext';
import Api from "../utils/Api"

class Directory extends Component{
    state = {
        orderCustomerData: undefined,
        productCate: undefined,
        categoryData: undefined,
        cartData: [],
        categorySelection: undefined,
        searchType: undefined,
        productData: undefined,
        invProductsData: undefined,
        invInventoryData: undefined,
        invProductSuppliers: undefined,
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

    invContextProductStore = data => {
        this.setState({invProductsData: data})
    }

    invContextInventoryStore = data => {
        this.setState({invInventoryData: data})
    }

    invContextProductSupplierStore = data => {
        this.setState({invProductSuppliers: data})
    }

    directoryDisplay = () =>{
        switch (this.context.currentDir) {
            case "Accounts Payable":
                return (<AccountsPay />);
            case "Accounts Receivable":
                return (<AccountsRec />);
            case "Admin Tools":
                return (<AdminTools />);
            case "Customers":
                return (<Customers />);
            case "Inventory":
                return (
                    <InventoryContext.Provider
                        value = {{
                            categories: this.state.productCate,
                            permission_level: this.props.permission_level,
                            products: this.state.invProductsData,
                            inventory: this.state.invInventoryData,
                            productSuppliers: this.state.invProductSuppliers,
                            storeProducts: this.invContextProductStore,
                            storeInventory: this.invContextInventoryStore,
                            storeProductSuppliers: this.invContextProductSupplierStore,
                        }}
                    >
                        <Inventory/>
                    </InventoryContext.Provider>
                );
            case "Order Form":
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
                    <Col md='auto' style={{width: '100%', display: 'flex', justifyContent: 'center', fontWeight: 'bold'}}>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{width: '100%'}}>
                        <Navbar.Brand href='' style={{width: '25%'}}>{this.context.currentDir}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                            <LoginContext.Consumer>
                            {login => (
                                <>
                                    {login.permissionLevel >= 1?
                                        <>
                                        <Nav.Link onClick={() => this.context.switchDir("Order Form")}>Order Form</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("Customers")}>Customers</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=2?
                                        <>
                                        <Nav.Link onClick={() => this.context.switchDir("Inventory")}>Inventory</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("Accounts Receivable")}>Accounts Receivable</Nav.Link>{" "}
                                        <Nav.Link onClick={() => this.context.switchDir("Accounts Payable")}>Accounts Payable</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=3?
                                    <>
                                        <Nav.Link onClick={() => this.context.switchDir("Admin Tools")}>Admin Tools</Nav.Link>{" "}
                                    </>
                                    :
                                    null}
                                </>
                            )}
                            </LoginContext.Consumer>
                            </Nav>
                            <Nav>
                                <Nav.Link variant="danger" href='' stye={{float: 'right', width: '25%'}}onClick={() => this.props.logoutHandler()}>Log Out</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    </Col>
                </Row>
                <br />
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