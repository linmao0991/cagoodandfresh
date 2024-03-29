import React, { Component } from "react";
import {Container, Row, Col, Navbar, Nav, NavDropdown} from "react-bootstrap";
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
import './directory.css'

class Directory extends Component{
    state = {
        navExpanded: false,
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
        invSelectedProduct: undefined,
        cartTotalSales: 0.00,
        paymentInfo: {
            paymentAmount: 0,
            paymentType: "Pay Type",
            checkNumber: null,
        },
        invNewInvoiceDetails: {
            ap_invoice_number: '',
            purchase_order_number: '',
            invoice_date: '',
            due_date: '',
            receive_date: '',
            account_number: '',
            invoice_total: 0,
            payment_status: '',
            supplier_id: '',
            supplier_name: '',
            paid_amount: 0,
            lot: '',
        },
        invNewInvoiceItems: [],
        invSubDirectory: undefined,
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

    invContextSelectedProductStore = data => {
        this.setState({invSelectedProduct: data})
    }

    invContextStoreNewInvoiceDetails = (data) => {
        this.setState({invNewInvoiceDetails: data})
    }

    invContextStoreNewInvoiceItems = (data) => {
        this.setState({invNewInvoiceItems: data})
    }

    invContextStoreSubDir = (data) => {
        this.setState({invSubDirectory: data})
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
                            subdirectory: this.state.invSubDirectory,
                            categories: this.state.productCate,
                            permission_level: this.props.permission_level,
                            products: this.state.invProductsData,
                            inventory: this.state.invInventoryData,
                            productSuppliers: this.state.invProductSuppliers,
                            selectedProduct: this.state.invSelectedProduct,
                            newInvoiceDetails: this.state.invNewInvoiceDetails,
                            newInvoiceItems: this.state.invNewInvoiceItems,
                            storeProducts: this.invContextProductStore,
                            storeInventory: this.invContextInventoryStore,
                            storeProductSuppliers: this.invContextProductSupplierStore,
                            storeSelectedProduct: this.invContextSelectedProductStore,
                            storeNewInvoiceDetails: this.invContextStoreNewInvoiceDetails,
                            storeNewInvoiceItems: this.invContextStoreNewInvoiceItems,
                            storeSubDirectory: this.invContextStoreSubDir,
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

    setNavExpanded(expanded) {
        this.setState({ navExpanded: expanded });
    }
    
    closeNav() {
        this.setState({ navExpanded: false });
    }

    switchToInventory = (subDirectory) => {
        this.invContextStoreSubDir(subDirectory)
        this.context.switchDir("Inventory")
        this.closeNav()
    }

    render(){
        return(
            <Container fluid>
                <Row>
                    <Col md='auto' style={{width: '100%', display: 'flex', justifyContent: 'center', fontWeight: 'bold', padding: '0 0 0 0'}}>
                    <Navbar onToggle={() => this.setNavExpanded(!this.state.navExpanded)} fixed="top" expanded={this.state.navExpanded} expand="lg" bg="dark" variant="dark" style={{width: '100%'}}>
                        <Navbar.Brand href=''>{this.context.currentDir}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav style={{margin: 'auto'}}>
                            <LoginContext.Consumer>
                            {login => (
                                <>
                                    {login.permissionLevel >= 1?
                                        <>
                                        <Nav.Link onClick={() => {this.context.switchDir("Order Form");this.closeNav()}}>Order Form</Nav.Link>{" "}
                                        <Nav.Link onClick={() => {this.context.switchDir("Customers");this.closeNav()}}>Customers</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=2?
                                        <>
                                        {/* <Nav.Link onClick={() => {this.context.switchDir("Inventory");this.closeNav()}}>Inventory</Nav.Link>{" "} */}
                                        <NavDropdown title="Inventory" id="basic-nav-dropdown" variant='dark'>
                                            <NavDropdown.Item 
                                                href=""
                                                onClick={() => this.switchToInventory("Search-Inventory")}
                                            >
                                                Search
                                            </NavDropdown.Item>
                                            <NavDropdown.Item 
                                                href=""
                                                onClick={() => this.switchToInventory("Add-Inventory")}
                                            >
                                                 Add Inventory
                                            </NavDropdown.Item>
                                            <NavDropdown.Item 
                                                href=""
                                                disabled
                                            >
                                                Add Product
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                        <Nav.Link disabled={true} onClick={() => {this.context.switchDir("Accounts Receivable");this.closeNav()}}>Accounts Receivable</Nav.Link>{" "}
                                        <Nav.Link disabled={true} onClick={() => {this.context.switchDir("Accounts Payable");this.closeNav()}}>Accounts Payable</Nav.Link>{" "}
                                        </>
                                    :
                                    null}
                                    {login.permissionLevel >=3?
                                    <>
                                        <Nav.Link disabled={true} onClick={() => {this.context.switchDir("Admin Tools");this.closeNav()}}>Admin Tools</Nav.Link>{" "}
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
                <Row style={{marginTop: "75px"}}>
                    <Col>
                        {this.directoryDisplay()}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Directory