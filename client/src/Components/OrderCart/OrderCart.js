import React, {useContext} from "react";
import {Table, Container, Button} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function OrderCart (props) {
    const orderContext = useContext(OrderContext);

    const removeCartItem = (cartIndex) => {
        let newCart = [...orderContext.cartData]
        //Remove cart item at cartIndex
        newCart.splice(cartIndex,1)
        //Set totalCartSales to total sales of cart
        let totalCartSales = newCart.reduce((accumulator, currentValue) => {
            return (accumulator+(currentValue.sale_price*currentValue.quantity))
        },0).toFixed(2)
        //Store Context
        orderContext.storeCartTotalSales(totalCartSales)
        orderContext.storeCart(newCart)
    }

    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            height: "425px",
            borderStyle: 'solid',
            borderColor: 'white',
            },
        thead: {
            overflowY: 'scroll',
            fontSize: "14px",
            display:'block',
            position: 'relative',
        },
        scroll: {
            display: 'block',
            emptyCells: 'show'
        },
        tr: {
            display: 'flex'
        },
        tdth: {
            display: 'block',
            textAlign: 'left'
        },
        //Button Column Width
        col_1_width :{
            width: '11%'
        },
        //Count Column
        col_2_width :{
            width: '9%'
        },
        //Product Column
        col_3_width :{
            width: '50%'
        },
        //Unit Price
        col_4_width :{
            width: '15%'
        },
        //Total Sale Price
        col_5_width :{
            width: '15%'
        }
    }

    return(
        <Container fluid>
            <Table
                bordered
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
                        <th >Total Items: {orderContext.cartData.reduce((accumulator, currentValue) => {
                            return accumulator+currentValue.quantity}, 0)}
                        </th>
                        <th>Total: ${orderContext.cartTotalSales
                            // (orderContext.cartData.reduce((accumulator, currentValue) => {
                            // return accumulator+(currentValue.quantity * currentValue.sale_price)
                            // }, 0)).toFixed(2)
                            }
                        </th>
                    </tr>
                </thead>
            </Table>
            <Table
                striped
                bordered
                hover
                size = "sm"
                variant="dark"
            >
                {/* <colgroup>
                    <col style={{width: "5%"}}/>
                    <col style={{width: "5%"}}/>
                    <col style={{width: "60%"}}/>
                    <col style={{width: "15%"}}/>
                    <col style={{width: "15%"}}/>
                </colgroup> */}
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <th style={{...listingStyle.col_1_width,...listingStyle.tdth}}>
                            <Button size="sm" variant="outline-danger" onClick={() => props.emptyCart("empty-cart")}>Empty</Button>
                        </th>
                        <th style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Count</th>
                        <th style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Item Name</th>
                        <th style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Price</th>
                        <th style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Total</th>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {orderContext.cartData.length > 0? 
                        orderContext.cartData.map((cartItem, index)=>{
                            return(
                                <tr key={index} style={listingStyle.tr}>
                                    <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}><Button onClick={() => removeCartItem(index)} size="sm" variant="outline-danger">X</Button></td>
                                    <td style={{textAlign: "center",...listingStyle.col_2_width,...listingStyle.tdth}}>{cartItem.quantity}</td>
                                    <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{cartItem.name_english} {cartItem.name_chinese}</td>
                                    <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{cartItem.sale_price}</td>
                                    <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{(cartItem.quantity * cartItem.sale_price).toFixed(2)}</td>
                                </tr>
                            )
                        })
                    : 
                        <tr style={listingStyle.tr}>
                            <td style={{textAlign: 'center',width:'100%'}}>Empty Cart</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </Container>
    )
}

export default OrderCart;