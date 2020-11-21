import React, {Component} from "react";
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import SearchInventory from '../../Components/SearchInventory/SearchInventory';
import InventoryContext from '../../Context/InventoryContext';

class Inventory extends Component{
    state = {
        displayType: '',
    }

    switchDisplay = () => {
        switch(this.state.displayType){
            case 'Search Inventory':
                return(
                    <SearchInventory />
                )
            default:
                return(
                    <></>
                )
        }
    }

    render(){
        return(
            <Container fluid>
                <Row>
                    <Col>
                        <Button variant='secondary' onClick={()=> this.setState({displayType: 'Search Inventory'})}>Search Inventory</Button>{' '}
                        <Button variant='secondary' onClick={()=> this.setState({displayType: 'Add Product'})}>Add New Product</Button>{' '}
                        <Button variant='secondary' onClick={()=> this.setState({displayType: 'Add Inventory'})}>Add Inventory</Button>{' '}
                    </Col>
                    <Col>
                    </Col>
                    <Col></Col>
                </Row>
                <br />
                <Row>
                    {this.switchDisplay()}
                </Row>
            </Container>
        )
    }
}

export default Inventory;