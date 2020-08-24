import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext";
import Api from "../../Utils/Api";
import {Modal, Button} from "react-bootstrap";
import CustomerDisplay from "../../Components/CustomerDisplay/CustomerDisplay"

//Covert this component to a class component
function OrderForm (){
    const directoryContext = useContext(DirectoryContext);
    const [phone, phoneInput] = useState(undefined);
    const [name, nameInput] = useState(undefined);
    const [account, accountInput] = useState(undefined);
    const [show, setShow] = useState(false);
    const [displayCustomers, setCustToggle] = useState(false);
    const [customerData, setCustData] = useState(undefined);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const showCustomers = () => setCustToggle(!displayCustomers);
    const storeCustData = (data) => setCustData(data);

    const getCustomerInfo = (event) => {
        event.preventDefault();
        Api.getCustomerInfo({
            customer_account_number:account,
            business_phone_number: phone,
            restaurant_name_english: name
        }).then ( info => {
            console.log(info.data)
            storeCustData(info.data)
            showCustomers(info.data)
        }).catch( err => {
            console.log(err)
        })
    }

    const selectCustomer = () =>{

    }

    const renderCustomerData = () => {
        console.log(customerData);
        if(customerData.length > 0 ){
            customerData.forEach(customer => {
                return (
                    <CustomerDisplay
                    data = {customer}
                    selectCustomer = {selectCustomer}
                    />
                )
            })
        }else{

        }
    }

    return(
        <div>
            <div>
                <Button onClick={() => directoryContext.switchDir(directoryContext.previousDir)}>Back</Button>
                <h1>Order Form</h1>
                <Button onClick={handleShow}>Find Customers</Button>
            </div>

            <Modal 
                show={show} 
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Find Customers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                    <input
                        value = {account}
                        type = "text"
                        label = "account number"
                        autoComplete= "text"
                        onChange = {event => accountInput(event.target.value)}
                        className="form-control validate"
                    />
                    <br />
                    <input
                        value = {phone}
                        type = "text"
                        label = "phone number"
                        autoComplete= "text"
                        onChange = {event => phoneInput(event.target.value)}
                        className="form-control validate"
                    />
                    <br />
                    <input
                        value = {name}
                        type = "text"
                        label = "name"
                        autoComplete= "text"
                        onChange = {event => nameInput(event.target.value)}
                        className="form-control validate"
                    />
                    <br />
                </form>
                    <Button onClick={event => getCustomerInfo(event)}>Get Info</Button>
                </Modal.Body>
                <Modal.Footer>
                    {displayCustomers?
                        renderCustomerData()
                    : 
                    null}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default OrderForm;