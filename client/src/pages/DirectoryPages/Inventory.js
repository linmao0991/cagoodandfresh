import React, {Component} from "react";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import InventoryDisplay from '../../Components/InventoryDisplay/InventoryDisplay';
import InventoryContext from '../../Context/InventoryContext';

class Inventory extends Component{
    state = {
        testValue: "blue",
    }

    changeTestValue = (value) => {
        this.setState({testValue: value})
    }

    render(){
        return(
            <Container fluid>
                <Row className="justify-content-md-center"> 
                    <Col md="auto">
                        <h1>Inventory</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="info">Add New Product</Button>{' '}
                        <Button variant='info'>Add Inventory</Button>{' '}
                    </Col>
                    <Col>
                    </Col>
                    <Col></Col>
                </Row>
                <br />
                <Row>
                    <InventoryDisplay />
                </Row>
            </Container>
        )
    }
}

export default Inventory;