import React, {useState} from 'react';
import {Modal, Button, InputGroup, FormControl, Table, Container, Badge, Card} from 'react-bootstrap';

export function ViewProductModal(props){
    
    const [showModal, setShowModal] = useState(false)
    const [modalFunction, setModalFunction] = useState(false)
    const [selectedInventory, setInventory] = useState(null)

    const switchModalFunction = (func, inventory) => {
        setInventory(inventory)
        setModalFunction(func)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleProductFunctions = () => {
        switch (modalFunction){
            case 'view-transactions':
                return(
                    <VewTransactions
                        inventory = {selectedInventory}
                        closeModal = {closeModal}
                        product = {props.product}
                    />
                )
        }
    }

    return(
        <>
            <Modal.Header style={{display:'flex', justifyContent:'center'}}>
                <Modal.Title>{props.product.name_english.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Table 
                        striped 
                        bordered 
                        hover
                        variant="dark">
                        <thead>
                            <tr>
                                <th>Current Qt</th>
                                <th>Sale Price</th>
                                <th>Cost</th>
                                <th>Transactions</th>
                                <th>Received</th>
                                <th>Initial Qt</th>
                                <th>Supplier</th>
                                <th>Invoice #</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.productInventory.map((inventory, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{width: "10%"}}>{inventory.current_quantity}</td>
                                        <td style={{width: "13%"}}>${Number(inventory.sale_price).toFixed(2)} <Badge variant="warning">Edit</Badge></td>
                                        <td style={{width: "13%"}}>${Number(inventory.cost).toFixed(2)}</td>
                                        <td style={{width: "10%"}}>
                                            {inventory.inventory_transactions.length} <Badge 
                                                onClick={() => {switchModalFunction('view-transactions', inventory)}} 
                                                variant="warning">View</Badge></td>
                                        <td style={{width: "15%"}}>{inventory.receive_date}</td>
                                        <td style={{width: "10%"}}>{inventory.invoice_quantity}</td>
                                        <td style={{width: "15%"}}>{inventory.supplier_name}</td>
                                        <td style={{width: "14%"}}>{inventory.ap_invoice_number}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>

            {showModal?
                <Modal
                show={showModal}
                onHide={closeModal}
                backdrop="static"
                size="xl"
                keyboard={false}>
                    {handleProductFunctions()}
                </Modal>
                :
                null
            }
        </>
    )
}

function VewTransactions (props){
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.product.name_english.toUpperCase()} - Trasnactions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table 
                striped 
                bordered 
                hover
                variant="dark">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Sale Price</th>
                        <th>Cost</th>
                        <th>Invoice #</th>
                        <th>Total Sale</th>
                        <th>Total Cost</th>
                        <th>Gross</th>
                    </tr>
                </thead>
                <tbody>
                    {props.inventory.inventory_transactions.map((transaction, index) => {
                        return (
                            <tr key={index}>
                                <td style={{width: "10%"}}>{
                                    transaction.createdAt.slice(0,10)
                                    }</td>
                                <td style={{width: "10%"}}>{transaction.quantity}</td>
                                <td style={{width: "11%"}}>${Number(transaction.sale_price).toFixed(2)}</td>
                                <td style={{width: "11%"}}>${Number(transaction.cost).toFixed(2)}</td>
                                <td style={{width: "16%"}}>{transaction.ar_invoice_number}</td>
                                <td style={{width: "14%"}}>${(Number(transaction.quantity)*Number(transaction.sale_price)).toFixed(2)}</td>
                                <td style={{width: "14%"}}>${(Number(transaction.quantity)*Number(transaction.cost)).toFixed(2)}</td>
                                <td style={{width: "14%"}}>
                                    {
                                    (Number(transaction.quantity)*Number(transaction.sale_price)-Number(transaction.quantity)*Number(transaction.cost)).toFixed(2)
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </>
    )
}