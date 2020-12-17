import React, { useState, useContext } from 'react';
import { Table, Badge, Popover, Button, Spinner, OverlayTrigger } from 'react-bootstrap';
import Api from '../../utils/Api';
import InventoryContext from '../../context/InventoryContext';
import './productInventory.css'

function ProductInventory(props) {
    const inventoryContext = useContext(InventoryContext)
    const listingStyle = {
        tbody: {
            display: 'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            maxHeight: props.tableHeight,
            borderStyle: 'solid',
            //width: '100%'
        },
        thead: {
            fontSize: "14px",
            display: 'block',
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
        //Quantity
        col_1_width: {
            width: '8%'
        },
        //Sale Price
        col_2_width: {
            width: '13%'
        },
        //Cost
        col_3_width: {
            width: '13%'
        },
        //Transactions
        col_4_width: {
            width: '10%'
        },
        //Date Received
        col_5_width: {
            width: '12%'
        },
        //Initial Quantity
        col_6_width: {
            width: '8%'
        },
        //Supplier
        col_7_width: {
            width: '12%'
        },
        //Invoice Number
        col_8_width: {
            width: '14%'
        },
        //Lot Number
        col_9_width: {
            width: '10%'
        }
    }

    return (
        <Table
            striped
            bordered
            hover
            variant="dark"
            style={props.style}>
            <thead style={listingStyle.thead}>
                <tr style={listingStyle.tr}>
                    <th style={{ ...listingStyle.col_1_width, ...listingStyle.tdth }}>Quantity</th>
                    <th style={{ ...listingStyle.col_2_width, ...listingStyle.tdth }}>Sale Price</th>
                    <th style={{ ...listingStyle.col_3_width, ...listingStyle.tdth }}>Cost</th>
                    <th style={{ ...listingStyle.col_4_width, ...listingStyle.tdth }}>Transactions</th>
                    <th style={{ ...listingStyle.col_5_width, ...listingStyle.tdth }}>Received</th>
                    <th style={{ ...listingStyle.col_6_width, ...listingStyle.tdth }}>Initial Qt</th>
                    <th style={{ ...listingStyle.col_7_width, ...listingStyle.tdth }}>Supplier</th>
                    <th style={{ ...listingStyle.col_8_width, ...listingStyle.tdth }}>Invoice #</th>
                    <th style={{ ...listingStyle.col_9_width, ...listingStyle.tdth }}>Lot#</th>
                </tr>
            </thead>
            <tbody style={listingStyle.tbody}>
                {/* {props.productInventory.map((inventory, index) => { */}
                {inventoryContext.inventory.map((inventory, index) => {
                    return (
                        <tr key={index} style={listingStyle.tr}>
                            <td style={{ ...listingStyle.col_1_width, ...listingStyle.tdth }}>{inventory.current_quantity}</td>
                            <td style={{ ...listingStyle.col_2_width, ...listingStyle.tdth }}>
                                <PopOverComponent
                                    inventory={inventory}
                                    index={index}
                                    column={'sale_price'}
                                />
                            </td>
                            <td style={{ ...listingStyle.col_3_width, ...listingStyle.tdth }}>
                                <PopOverComponent
                                    inventory={inventory}
                                    index={index}
                                    column={'cost'}
                                />

                            </td>
                            <td style={{ ...listingStyle.col_4_width, ...listingStyle.tdth }}>
                                {inventory.inventory_transactions.length}
                                <Badge
                                    onClick={() => { props.switchModalFunction('view-transactions', 'xl', inventory) }}
                                    variant="warning"
                                    as="button"
                                    style={{ float: 'right' }}
                                >
                                    View
                                </Badge>
                            </td>
                            <td style={{ ...listingStyle.col_5_width, ...listingStyle.tdth }}>{inventory.receive_date}</td>
                            <td style={{ ...listingStyle.col_6_width, ...listingStyle.tdth }}>{inventory.invoice_quantity}</td>
                            <td style={{ ...listingStyle.col_7_width, ...listingStyle.tdth }}>{inventory.supplier_name}</td>
                            <td style={{ ...listingStyle.col_8_width, ...listingStyle.tdth }}>{inventory.ap_invoice_number}</td>
                            <td style={{ ...listingStyle.col_9_width, ...listingStyle.tdth }}>{inventory.lot}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default ProductInventory;

function PopOverComponent(props) {
    const popOverStyle = {
        backgroundColor: "#404040",
        color: "white",
        boarderStyle: 'solid',
        borderColor: 'gray',
    }

    const inventoryContext = useContext(InventoryContext)
    const [currentValue, setCurrentValue] = useState(Number(props.inventory[props.column]).toFixed(2))
    const [newValue, setNewValue] = useState(Number(props.inventory[props.column]).toFixed(2))
    const [spinner, setSpinner] = useState(false)

    const handleSetNewValue = event => {
        event.preventDefault()
        setNewValue(event.target.value)
    }

    const submitNewValue = () => {
        setSpinner(true)
        Api.updateInventory({
            id: props.inventory.id,
            updates: {
                [props.column]: Number(newValue).toFixed(2)
            }
        }).then(result => {
            Api.getInventoryByProductID({
                productCode: props.inventory.product_code,
                //allInventory means get all inventory including 0 quantity left.
                allInventory: true,
            }).then(results => {
                inventoryContext.storeInventory(results.data)
                setSpinner(false)
                setCurrentValue(Number(newValue).toFixed(2))
                document.body.click()
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const popover = (
        <Popover id={"popover" + props.index} style={popOverStyle} >
            <Popover.Content>
                <div style={{ padding: '5px' }}>
                    <div>
                        <label style={{ color: 'white' }} htmlFor={'new_' + props.column + props.index}>NEW {props.column.toUpperCase().replace(/_/g, " ")}</label><br />
                        <input
                            type="number"
                            id={'new_' + props.column + props.index}
                            value={newValue}
                            onChange={(event) => handleSetNewValue(event)}
                        />
                    </div>
                    <br />
                    <div>
                        <Button
                            disabled={newValue === '' ? true : false}
                            size="sm"
                            variant="success"
                            onClick={submitNewValue}
                            style={{ width: '60px' }}
                        >
                            {spinner ?
                                <Spinner animation="border" role="status" size='sm'>
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                : <>✓</>}
                        </Button>
                        <Button
                            style={{ float: 'right', width: '60px' }}
                            size="sm"
                            variant="danger"
                            onClick={() => { document.body.click() }}
                        >✗</Button>
                    </div>
                </div>
            </Popover.Content>
        </Popover>
    )

    return (
        <>
            {Number(currentValue) < Number(props.inventory.cost) && props.column === 'sale_price' ?
                <span style={{ color: 'red', fontWeight: 'bold' }}>${Number(currentValue).toFixed(2)}</span>
                :
                <span>${Number(currentValue).toFixed(2)}</span>
            }
            {inventoryContext.permission_level >= 2 ?
                <OverlayTrigger trigger="click" placement="right" rootClose={true} overlay={popover}>
                    <Badge
                        variant="warning"
                        as="button"
                        style={{ float: 'right' }}
                    >Edit
                    </Badge>
                </OverlayTrigger>
                : null}
        </>
    )
}