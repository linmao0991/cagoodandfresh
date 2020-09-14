import React, {Component} from "react";
import Api from "../../Utils/Api";
import {Modal, Button, Container, Row, Col, Table} from "react-bootstrap";
import CustomerDisplay from "../../Components/CustomerDisplay/CustomerDisplay";
import OrderCart from "../../Components/OrderCart/OrderCart";
import OrderContext from "../../Context/OrderContext";
import CategorySelection from "../../Components/CategorySelection/CategorySelection";
import ProductListing from "../../Components/ProductListing/ProductListing";
import SearchProduct from '../../Components/SearchProduct/SearchProduct';

const myBorder = {
    //    borderStyle: "solid",
    //    borderColor: "white"
}

class OrderForm extends Component{
    state = {
        phone: undefined,
        name: undefined,
        account: undefined,
        show: false,
        messageShow: false,
        messageType: undefined,
        displayCustomers: false,
        customerData: undefined,
        selectedCustomer: undefined,
        orderCart: undefined,
        searchingCustomer: false,
    }

    static contextType = OrderContext;

    handleEmptyCart = () =>{
        let emptyCart = []
        this.context.storeCart(emptyCart)
        this.messageModalHandler()
    }

    handleAccountInput = input =>{
        this.setState({account: input})
    }

    handlePhoneInput = input =>{
        this.setState({phone: input})
    }

    handleNameInput = input =>{
        this.setState({name: input})
    }

    handleClose = () => {
        this.setState({show: false})
        this.setState({displayCustomers: false})
    };

    handleShow = () => {
        this.setState({show: true})
    };

    showCustomers = () => {
        this.setState({displayCustomers: !this.state.displayCustomers})};

    getCustomerInfo = (event) => {
        event.preventDefault();
        this.setState({searchingCustomer: true})
        Api.getCustomerInfo({
            customer_account_number: this.state.account,
            business_phone_number: this.state.phone,
            restaurant_name_english: this.state.name
        }).then ( info => {
            this.setState({
                customerData: info.data,
                displayCustomers: true,
                account: undefined,
                phone: undefined,
                name: undefined,
                searchingCustomer: false
            })
        }).catch( err => {
            console.log(err)
        })
    }

    selectCustomer = (data) =>{
        this.handleClose();
        //Stores selected customer to state
        this.setState({selectedCustomer: data});
        //Stores selected customer to OrderContext, Provider in Directory.js
        this.context.storeCustomer(data)
    }

    formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null
      }

    messageModalHandler = (messageType) =>  {
        this.setState({messageType: messageType})
        this.setState({messageShow: !this.state.messageShow})
    }
    
    messageModalSwitch = (messageType) => {
        switch (messageType){
            case "empty-cart":
                return(
                    <>
                    <Modal.Header closeButton>
                        <Modal.Title>Empty Cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you Sure?
                    </Modal.Body>
                    <Modal.Footer>
                        <Row>
                            <Col>
                                <Button onClick={this.handleEmptyCart}variant="danger">Yes</Button>
                            </Col>
                            <Col>
                                <Button onClick={this.messageModalHandler} variant="success">No</Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                    </>
                )
            default:
                return(
                null
                )
        }

    }

    productSearchType = () => {
        switch (this.context.searchType) {
            case "search":
                return(
                    <Container fluid>
                        <SearchProduct />
                    </Container>
                );
            case "selection":
                return(
                    <Container fluid>
                        {this.context.productCate.map((category, index) =>{
                            return(
                            <CategorySelection
                                category = {category}
                                key = {index}
                            />)
                        })}
                    </Container>
                    );
            case "selection-product":
                return(
                    <Container fluid>
                        <ProductListing 
                            allProductData = {this.context.productData}
                            categorySelection = {this.context.categorySelection.toUpperCase()}
                        />
                    </Container>
                );
            default:
                //if(this.context.categorySelection)
                return(<div>Select a search tye.</div>)
        }
    }

    render() {
        return(
            <>
            <Container fluid>
                <br />
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <h1>Order Form</h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6} style={myBorder}>
                        <Row>
                            <Col>
                                <Button variant="info" onClick={() => this.context.storeSearchType("search")}>Search</Button> <Button variant="info" onClick={() => this.context.storeSearchType("selection")}>Selection</Button>
                            </Col>
                            <Col>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        {/* Item Selection */}
                        <br />
                        <Row>
                            {/* <Container fluid> */}
                                {this.productSearchType()}
                            {/* </Container> */}
                        </Row>
                    </Col>

                    {/* Order Cart Section */}
                    <Col>
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <b>Customer</b>
                                    </Col>
                                    <Col>
                                        <Button size="sm" variant="info" onClick={this.handleShow}>Find Customers</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {this.context.selectedCustomerData? 
                                        <>
                                            <br/>{this.context.selectedCustomerData.restaurant_name_english} 
                                            {this.context.selectedCustomerData.restaurant_name_chinese? <><br/>{this.context.selectedCustomerData.restaurant_name_chinese}</>: null}
                                            <br/>{this.formatPhoneNumber(this.context.selectedCustomerData.business_phone_number)}
                                            <br/>{this.context.selectedCustomerData.billing_street}
                                            <br/>{this.context.selectedCustomerData.billing_city}, {this.context.selectedCustomerData.billing_state} {this.context.selectedCustomerData.billing_zipcode}
                                        </>
                                        :
                                        <><br/>None</>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Button size="sm" variant="danger" onClick={() => this.messageModalHandler("empty-cart")}>Empty Cart</Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <OrderCart/>
                        </Row>
                    </Col>
                </Row>
            </Container>

                <Modal 
                    show={this.state.show} 
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    size ="xl"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>Find Customers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <Container>
                            <Row>
                                <Col></Col>
                                <Col xs={6}>
                                    <form>
                                        <input
                                            value = {this.state.phone}
                                            type = "text"
                                            label = "phone number"
                                            placeholder ="Phone Number"
                                            //autoComplete= "text"
                                            onChange = {event => this.handlePhoneInput(event.target.value)}
                                            className="form-control validate"
                                        />
                                        <br />
                                        <input
                                            value = {this.state.account}
                                            type = "text"
                                            label = "account number"
                                            placeholder ="Account Number"
                                            //autoComplete= "text"
                                            onChange = {event => this.handleAccountInput(event.target.value)}
                                            className="form-control validate"
                                        />
                                        <br />
                                        <input
                                            value = {this.state.name}
                                            type = "text"
                                            label = "name"
                                            placeholder = "Name"
                                            //autoComplete= "text"
                                            onChange = {event => this.handleNameInput(event.target.value)}
                                            className="form-control validate"
                                        />
                                        <br />
                                    </form>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Container>
                        <Button 
                            onClick={event => this.getCustomerInfo(event)}
                            variant=
                                {this.state.searchingCustomer?
                                    "warning"
                                    :
                                    "info"
                                }
                            disabled=
                                {this.state.searchingCustomer?
                                    true
                                    :
                                    false
                                }
                        >
                            {this.state.searchingCustomer?
                            "Searching..."
                            :
                            "Search"}
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.displayCustomers?
                            <Container>
                                {this.state.customerData.map(data => (
                                    <CustomerDisplay 
                                        data = {data}
                                        key = {data.id}
                                        selectCustomer = {this.selectCustomer}
                                    />
                                ))}
                            </Container>
                        : 
                        null}
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.messageShow} 
                    onHide={this.messageModalHandler}
                    backdrop="static"
                    keyboard={false}
                    size ="sm">
                    {this.state.messageShow? 
                        this.messageModalSwitch(this.state.messageType)
                        :
                        null
                    }
                </Modal>
            </>
        )
    }
}

export default OrderForm;