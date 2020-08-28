import React from "react";
import {Table, Container, Row, Col} from "react-bootstrap";

function orderCart () {

    return(
        <Table 
        bordered 
        style={{
            color: "white",
            fontSize: "12px"
        }}
        >
            <thead>
                <tr>
                    <th>Count</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Broccoli</td>
                    <td>17.85</td>
                    <td>17.95</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>Green Pepper</td>
                    <td>15.85</td>
                    <td>15.95</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default orderCart;