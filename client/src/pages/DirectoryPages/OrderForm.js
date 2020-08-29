import React, {Component} from "react";
import Api from "../../Utils/Api";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import CustomerDisplay from "../../Components/CustomerDisplay/CustomerDisplay";
import OrderCart from "../../Components/OrderCart/OrderCart";
import OrderContext from "../../Context/OrderContext";

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
        displayCustomers: false,
        customerData: undefined,
        selectedCustomer: undefined,
        orderCart: undefined,
    }

    static contextType = OrderContext;

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

    storeCustData = (data) => {
        this.setState({customerData: data})
    };

    getCustomerInfo = (event) => {
        event.preventDefault();
        Api.getCustomerInfo({
            customer_account_number: this.state.account,
            business_phone_number: this.state.phone,
            restaurant_name_english: this.state.name
        }).then ( info => {
            this.storeCustData(info.data)
            this.setState({displayCustomers: true})
            this.setState({account: undefined})
            this.setState({phone: undefined})
            this.setState({name: undefined})
        }).catch( err => {
            console.log(err)
        })
    }

    selectCustomer = (data) =>{
        this.handleClose();
        //Stores selected customer to state
        this.setState({selectedCustomer: data});
        //Stores selected customer to OrderContext, Provider in Directory.js
        this.context.orderContextStore(data, this.state.orderCart)
    }

    formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null
      }

    render() {
        return(
            <Container fluid>
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
                    <Col xs={8} style={myBorder}>
                        <Row>
                            <Col>
                                <Button variant="info" onClick={this.handleShow}>Find Customers</Button>
                            </Col>
                            <Col>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        {/* Item Selection */}
                        <Row>

                        </Row>
                    </Col>

                    {/* Order Cart Section */}
                    <Col>
                        <Row>
                            <Col>
                            <p><b>Customer</b>
                            {this.context.selectedCustomerData? 
                                <>
                                    <br/>{this.context.selectedCustomerData.restaurant_name_english} 
                                    {this.context.selectedCustomerData.restaurant_name_chinese? <><br/>{this.context.selectedCustomerData.restaurant_name_chinese}</>: null}
                                    <br/>{this.formatPhoneNumber(this.context.selectedCustomerData.business_phone_number)}
                                    <br/>{this.context.selectedCustomerData.billing_street}
                                    <br/>{this.context.selectedCustomerData.billing_city}, {this.context.selectedCustomerData.billing_state} {this.context.selectedCustomerData.billing_zipcode}
                                </>
                                :
                                    <p>None</p>
                            }
                            </p>
                            </Col>
                            <Col>
                                <p><b>Cart Total</b>: $33.90</p>
                                <p><b>Total Items</b>: 2</p>
                            </Col>
                        </Row>
                        <Row>
                            <OrderCart/>
                        </Row>
                    </Col>
                </Row>

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
                        <Button onClick={event => this.getCustomerInfo(event)}>Get Info</Button>
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
            </Container>
        )
    }
}

export default OrderForm;