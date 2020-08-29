import React from "react";
import {Table, Container, Row, Col} from "react-bootstrap";

function orderCart () {

    return(
        <Table 
        bordered 
        size = "sm"
        style={{
            color: "white",
            fontSize: "14px"
        }}
        >
            <colgroup>
                <col style={{width: "10%"}}/>
                <col style={{width: "60%"}}/>
                <col style={{width: "15%"}}/>
                <col style={{width: "15%"}}/>
            </colgroup>
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
                    {/* Count */}
                    <td>1</td>
                    {/* Item */}
                    <td>Broccoli</td>
                    {/* Unit Price */}
                    <td>17.95</td>
                    {/* Total Price */}
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