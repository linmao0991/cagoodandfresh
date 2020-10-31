import React from 'react';
import {Button, Container, Row, Col, Table} from "react-bootstrap";;

function InventoryList (props){

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
        col_1_width :{
            width: '10%'
        },
        col_2_width :{
            width: '8%'
        },
        col_3_width :{
            width: '30%'
        },
        col_4_width :{
            width: '30%'
        },
        col_5_width :{
            width: '12%'
        },
        col_6_width :{
            width: '10%'
        }
    }

    return( 
        <>   
            <Table
                striped 
                bordered 
                hover
                variant="dark"
            >
                {/* <colgroup>
                    <col style={{width: "10%"}}/>
                    <col style={{width: "5%"}}/>
                    <col style={{width: "35%"}}/>
                    <col style={{width: "30%"}}/>
                    <col style={{width: "10%"}}/>
                    <col style={{width: "10%"}}/>
                </colgroup> */}
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{props.category.toUpperCase()}</td>
                        <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Stock</td>
                        <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Product Name English</td>
                        <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Product Name Chinese</td>
                        <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Holding</td>
                        <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>Size</td>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {props.inventoryData.map((product, index) => {
                        return(
                            <tr key={index} style={listingStyle.tr}>
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}><Button size="sm" variant="outline-success">Select</Button></td>
                                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>{product.inventory_count}</td>
                                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{product.name_english}</td>
                                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{product.name_chinese}</td>
                                <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{product.holding}</td>
                                <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>{product.weight} {product.measurement_system}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

export default InventoryList