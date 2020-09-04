import React, {useContext, useStat} from "react";
import {Table, Container, Row, Col} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function OrderCart () {
    const orderContext = useContext(OrderContext);

    return(
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
                                <td>{cartItem.sales_price}</td>
                                <td>{(cartItem.quantity * cartItem.sales_price).toFixed(2)}</td>
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
    )
}

export default OrderCart;