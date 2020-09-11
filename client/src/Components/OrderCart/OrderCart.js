import React, {useContext, useState} from "react";
import {Table, Container, Row, Col} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function OrderCart () {
    const orderContext = useContext(OrderContext);

    return(
        <Container fluid>
            {console.log(orderContext.cartData)}
            <Table
                bordered
                hover
                size = "sm"
                variant="dark"
                style={{
                    fontSize: "14px"
                }}
            >
                <colgroup>
                    <col style={{width: "50%"}}/>
                    <col style={{width: "50%"}}/>
                </colgroup>
                <thead>
                    <tr>
                        <th>Total Items: {orderContext.cartData.reduce((accumulator, currentValue) => {
                            return accumulator+currentValue.quantity}, 0)}
                        </th>
                        <th>Total: ${(orderContext.cartData.reduce((accumulator, currentValue) => {
                            console.log(accumulator+" : "+(currentValue.quantity * currentValue.sale_price).toFixed(2))
                            return accumulator+(currentValue.quantity * currentValue.sale_price)
                            }, 0)).toFixed(2)}
                        </th>
                    </tr>
                </thead>
            </Table>
            <Table 
                bordered
                hover
                size = "sm"
                variant="dark"
                style={{
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
                    {orderContext.cartData.length > 0? 
                        orderContext.cartData.map((cartItem, Index)=>{
                            return(
                                <tr key={Index}>
                                    <td>{cartItem.quantity}</td>
                                    <td>{cartItem.name_english} {cartItem.name_chinese}</td>
                                    <td>{cartItem.sale_price}</td>
                                    <td>{(cartItem.quantity * cartItem.sale_price).toFixed(2)}</td>
                                </tr>
                            )
                        })
                    : 
                        <tr>
                            <td></td>
                            <td>Empty Cart</td>
                            <td></td>
                            <td></td>
                        </tr>
                    }
                </tbody>
            </Table>
        </Container>
    )
}

export default OrderCart;