import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext";
import Api from "../../Utils/Api";
import {Modal, Button} from "react-bootstrap";

function OrderForm (){
    const directoryContext = useContext(DirectoryContext);
    const [phone, phoneInput] = useState(undefined);
    const [name, nameInput] = useState(undefined);
    const [account, accountInput] = useState(undefined);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getCustomerInfo = (event) => {
        event.preventDefault();
        Api.getCustomerInfo({
            customer_account_number:account,
            business_phone_number: phone,
            restaurant_name_english: name
        }).then ( info => {
            console.log(info)
        }).catch( err => {
            console.log(err)
        })
    }

    return(
        <div>
            <div>
                <button onClick={() => directoryContext.switchDir(directoryContext.previousDir)}>Back</button>
                <h1>Order Form</h1>
                <button onClick={handleShow}>Find Customers</button>
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
                    <button onClick={event => getCustomerInfo(event)}>Get Info</button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default OrderForm;