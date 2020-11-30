import React, {} from 'react'
import {Table, Modal, Button} from 'react-bootstrap'

function ViewTransactions (props){
    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            height: "500px",
            borderStyle: 'solid',
            //width: '100%'
            },
        thead: {
            fontSize: "14px",
            display:'block',
            overflowY: 'scroll',
            position: 'relative',
            //width: '100%'
        },
        scroll: {
            display: 'block',
            emptyCells: 'show'
        },
        tr: {
            //width: '100%',
            display: 'flex'
        },
        tdth: {
            //flexBasis: '100%',
            //flexGrow: 2,
            display: 'block',
            textAlign: 'left'
        },
        //Date
        col_1_width :{
            width: '10%'
        },
        //Quantity
        col_2_width :{
            width: '10%'
        },
        //Sale Price
        col_3_width :{
            width: '11%'
        },
        //Cost
        col_4_width :{
            width: '11%'
        },
        //Invoice Number
        col_5_width :{
            width: '18%'
        },
        //Total Sale
        col_6_width :{
            width: '14%'
        },
        //Total Cost
        col_7_width :{
            width: '14%'
        },
        //Gross
        col_8_width :{
            width: '12%'
        }
    }
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{props.product.name_english.toUpperCase()} - Transactions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table 
                    striped 
                    bordered 
                    hover
                    variant="dark">
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <th style={{...listingStyle.col_1_width,...listingStyle.tdth}}>Date</th>
                        <th style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Quantity</th>
                        <th style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Sale Price</th>
                        <th style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Cost</th>
                        <th style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Invoice #</th>
                        <th style={{...listingStyle.col_6_width,...listingStyle.tdth}}>Total Sale</th>
                        <th style={{...listingStyle.col_7_width,...listingStyle.tdth}}>Total Cost</th>
                        <th style={{...listingStyle.col_8_width,...listingStyle.tdth}}>Gross</th>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {props.inventory.inventory_transactions.map((transaction, index) => {
                        return (
                            <tr key={index} style={listingStyle.tr}>
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{
                                    transaction.createdAt.slice(0,10)
                                    }</td>
                                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>{transaction.quantity}</td>
                                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>${Number(transaction.sale_price).toFixed(2)}</td>
                                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>${Number(transaction.cost).toFixed(2)}</td>
                                <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{transaction.ar_invoice_number}</td>
                                <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>${(Number(transaction.quantity)*Number(transaction.sale_price)).toFixed(2)}</td>
                                <td style={{...listingStyle.col_7_width,...listingStyle.tdth}}>${(Number(transaction.quantity)*Number(transaction.cost)).toFixed(2)}</td>
                                <td style={{...listingStyle.col_8_width,...listingStyle.tdth}}>
                                    {
                                    (Number(transaction.quantity)*Number(transaction.sale_price)-Number(transaction.quantity)*Number(transaction.cost)).toFixed(2)
                                    }
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </>
    )
}

export default ViewTransactions;