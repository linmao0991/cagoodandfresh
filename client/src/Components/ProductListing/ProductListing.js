import React, {useContext, useState} from "react";
import {Container, Row, Col, Modal, Button} from "react-bootstrap"
import Api from "../../Utils/Api"
import OrderContext from "../../Context/OrderContext"

//Add Modal to display product information
//--Call to inventory table
//--Toggled by select button
//--display inventory counts
//----different records of inventory in at different prices
//--display detailed information

//Add function to select item to cart

function ProductListing (props){
    return(
        <>
        <Row>
            <Col xs={12}>
                <Button size="sm" variant="outline-success">Select</Button>{props.product.name_english}
            </Col>
        </Row>
        <hr/>
        </>
    )
}

export default ProductListing;