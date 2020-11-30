import React from 'react'
import {Table, Badge, Spinner} from 'react-bootstrap'

const SupplierList = (props) => {
    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            height: "250px",
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
        //View Button
        col_1_width :{
            width: '10%'
        },
        //Name
        col_2_width :{
            width: '20%'
        },
        //ID
        col_3_width :{
            width: '10%'
        },
        //Products
        col_4_width :{
            width: '60%'
        }
    }

    return(
        <Table
        striped 
        bordered 
        hover
        variant="dark"
        style={{width: '95%', margin: 'auto', marginTop: '3px'}}
    >
        <thead style={listingStyle.thead}>
            <tr style={listingStyle.tr}>
                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}></td>
                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Name</td>
                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>ID</td>
                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Products</td>
            </tr>
        </thead>
        <tbody style={listingStyle.tbody}>
            {props.supplierData?
                <>
                {props.supplierData.map((supplier, index) => {
                    return(
                        <tr key={index} style={listingStyle.tr}>
                            <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>
                                <Badge variant='warning' as='button' style={{margin: 'auto'}}>View</Badge>
                            </td>
                            <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>{supplier.name_chinese}</td>
                            <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{supplier.id}</td>
                            <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{supplier.products}</td>
                        </tr>
                    )
                })}
                </>
                :
                props.loading?
                <>
                    <Spinner animation="border" role="status" size='sm'>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </>
                :null
            }
        </tbody>
    </Table>
    )
}

export default SupplierList