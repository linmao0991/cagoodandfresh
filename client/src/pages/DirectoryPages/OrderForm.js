import React, {Component} from "react";
import Api from "../../Utils/Api";
import {Modal, Button, Container, Row, Col, Spinner} from "react-bootstrap";
import CustomerDisplay from "../../Components/CustomerDisplay/CustomerDisplay";
import OrderCart from "../../Components/OrderCart/OrderCart";
import OrderContext from "../../Context/OrderContext";
import CategorySelection from "../../Components/CategorySelection/CategorySelection";
import ProductListing from "../../Components/ProductListing/ProductListing";
import SearchProduct from '../../Components/SearchProduct/SearchProduct';
import Loading from '../../Components/Loading/Loading';
import orderContext from "../../Context/OrderContext";

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
        orderProcess: false,
    }

    static contextType = OrderContext;

    handleEmptyCart = () =>{
        let emptyCart = []
        this.context.storeCart(emptyCart)
        this.context.storeCartTotalSales(0)
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

    submitOrder = () => {
        //resets search type context
        this.context.storeSearchType(undefined)
        //Sets orderProcess to true, this toggles the submut button to show processing
        this.setState({
            orderProcess: true,
        })
        // Create orderData to send to server
        let orderDate = new Date().toString()
        let paymentStatus = () => {
            if( this.context.cartTotalSales > this.context.paymentInfo.paymentAmount && this.context.paymentInfo.paymentAmount > 0){
                return "Partial"
            }
            if( this.context.cartTotalSales = this.context.paymentInfo.paymentAmount ){
                return "Paid"
            }
            return "Unpaid"
        }

        let orderData = {
            customerData: this.context.selectedCustomerData,
            cartData: this.context.cartData,
            cartTotalSale: this.context.cartTotalSales,
            orderDate: orderDate,
            paymentInfo: this.context.paymentInfo,
            paymentStatus: paymentStatus(),
            transaction_type: "sale"
        }
        console.log(orderData)
        //Toggles the submit order modal to show a loading animation
        this.messageModalHandler('submit-order')
        //API call to submit order
        Api.submitOrder({
            orderData
        }).then(response => {
            console.log(response)
            //Toogles the submit button to active
            this.setState({
                orderProcess: false,
            })
            //Resets context for a new order
            this.context.storeCustomer(undefined)
            this.context.storeCart([])
            this.context.storeCartTotalSales(0)
            this.context.storeCategory(undefined)
            this.context.storeCategorySelection(undefined)
            this.context.storeSearchType(undefined)
            this.context.storePaymentInfo({
                paymentAmount: 0,
                paymentType: "Pay Type",
                checkNumber: null,
            })
            //toggles off the loading modal
            this.setState({messageShow: !this.state.messageShow})
        })
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
                        Empty Cart?
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
            case "submit-order":
                return(
                    <>
                    <Modal.Header style={{display:'flex', justifyContent:'center'}}>
                        <Modal.Title>Submitting Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            style={{display:'flex', justifyContent:'center'}}
                        >
                            <Spinner
                                as="span"
                                animation="border"
                                size="lg"
                                role="status"
                                aria-hidden="true"
                                variant="light"
                            >
                            </Spinner>
                            <span className="sr-only">Processing</span>
                        </div>
                    </Modal.Body>
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
                    <Container 
                        fluid
                        style={
                            {fontSize: "14px"},
                            {overflowY: "auto"},
                            {height:"500px"}
                        }
                    >
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
                <Row className="justify-content-md-center">
                    <Col md='auto'>
                        <h1>Order Form</h1>
                    </Col>
                </Row>
                <Row>
                    <Col xs={7}>
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
                                        <b>Customer</b><br/>
                                        {this.context.selectedCustomerData? 
                                        <>
                                            {this.context.selectedCustomerData.restaurant_name_english} 
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
                                <Row>
                                    <Col>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Button variant="info" onClick={this.handleShow} block>Find Customers</Button><br/>
                                <Button 
                                    variant={this.context.cartData.length>0 && !this.state.orderProcess? 'success': 'secondary'} 
                                    disabled={this.context.cartData.length>0 && !this.state.orderProcess? false: true}
                                    onClick = {this.submitOrder}
                                    block>
                                        {this.state.orderProcess?
                                            'Processing...'
                                            :
                                            'Submit Order'
                                        }
                                    </Button>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <OrderCart
                                emptyCart = {this.messageModalHandler}
                            />
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