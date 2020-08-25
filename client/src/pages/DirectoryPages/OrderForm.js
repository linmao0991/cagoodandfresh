import React, {useState, useContext, Component} from "react";
import DirectoryContext from "../../Context/DirectoryContext";
import Api from "../../Utils/Api";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import CustomerDisplay from "../../Components/CustomerDisplay/CustomerDisplay"

//Covert this component to a class component
class OrderForm extends Component{
    state = {
        phone: undefined,
        name: undefined,
        account: undefined,
        show: false,
        displayCustomers: false,
        customerData: undefined
    }

    static contextType = DirectoryContext

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
            //this.showCustomers(info.data)
        }).catch( err => {
            console.log(err)
        })
    }

    selectCustomer = () =>{

    }

    render() {
        return(
            <div>
                <div>
                    <Button onClick={() => this.context.switchDir(this.context.previousDir)}>Back</Button>
                    <h1>Order Form</h1>
                    <Button onClick={this.handleShow}>Find Customers</Button>
                </div>

                <Modal 
                    show={this.state.show} 
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    size ="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>Find Customers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                        <Button onClick={event => this.getCustomerInfo(event)}>Get Info</Button>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.displayCustomers?
                            <Container>
                                {this.state.customerData.map(data => (
                                    <CustomerDisplay 
                                        data = {data}
                                        key = {data.id}
                                    />
                                ))}
                            </Container>
                        : 
                        null}
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default OrderForm;