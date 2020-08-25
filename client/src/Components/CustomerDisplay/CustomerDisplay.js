import React from "react";
import {Row, Col, Button} from "react-bootstrap";

function CustomerDisplay(props){
    return(
        <div>
            <hr />
            <Row>
                <Col xs={3}>
                    <Button variant="info"
                        onClick = {() => props.selectCustomer(props.data)}
                    >Select</Button>
                </Col>
                <Col>
                    <p>{props.data.restaurant_name_english}</p>
                    <p>{props.data.restaurant_name_chinese}</p>
                    <p>{props.data.business_phone_number}</p>
                </Col>
                <Col>
                    <p>{props.data.billing_street}</p>
                    <p>{props.data.billing_city}, {props.data.billing_state} {props.data.billing_zipcode}</p>
                </Col>
            </Row>
            <hr />
        </div>
    );
}

export default CustomerDisplay;