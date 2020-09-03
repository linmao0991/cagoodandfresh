import React, {useContext, useState} from "react";
import {Modal, Container, Row, Col, Button, Table} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function InventoryModal (props) {
    const orderContext = useContext(OrderContext);
    const [show, toggleShow] = useState(props.show);

    return(
        <>
        {console.log(props.show)}
        <Modal
            size="lg"
            show={show}
            onHide={props.toggleShow}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.productData.name_english}
                </Modal.Title>
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
                                <th></th>
                                <th>Count</th>
                                <th>Sale Price</th>
                                <th>Cost</th>
                                <th>Received</th>
                                <th>Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.productInven.map((inventory, index) => {
                                return (
                                    <tr key={index}>
                                        <td><Button variant="outline-success" size="sm">Add</Button></td>
                                        <td>{inventory.current_quantity}</td>
                                        <td>${inventory.sale_price}</td>
                                        <td>${inventory.cost}</td>
                                        <td>{inventory.receive_date}</td>
                                        <td>{inventory.supplier_name}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <div>Footer</div>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default InventoryModal;