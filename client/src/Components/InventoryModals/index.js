import React, {useState, useContext} from 'react';
import {Modal, Button, InputGroup, FormControl, 
        Table, Container, Badge, Card, Popover, 
        OverlayTrigger, Row, Col, Spinner, 
        ListGroup, Accordion} from 'react-bootstrap';
import Api from '../../Utils/Api'
import InventoryContext from '../../Context/InventoryContext'

const popOverStyle = {
    backgroundColor: "#404040",
    color: "white",
}

export function ViewInventoryModal(props){
    
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({modalType: undefined, modalSize: 'xl'})
    const [selectedInventory, setInventory] = useState(null)

    const switchModalFunction = (modalType, modalSize, inventory) => {
        setInventory(inventory)
        setModalData({modalType: modalType, modalSize: modalSize})
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleProductFunctions = () => {
        switch (modalData.modalType){
            case 'view-transactions':
                return(
                    <ViewTransactions
                        inventory = {selectedInventory}
                        closeModal = {closeModal}
                        product = {props.product}
                    />
                )
        }
    }

    return(
        <>
            <Modal.Header style={{display:'flex', justifyContent:'center'}}>
                <Modal.Title>{props.product.name_english.toUpperCase()}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <ProductInventory 
                        product = {props.product}
                        productInventory = {props.productInventory}
                        switchModalFunction = {switchModalFunction}
                        tableHeight = '500px'
                    />
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>

            {showModal?
                <Modal
                show={showModal}
                onHide={closeModal}
                backdrop="static"
                size={modalData.modalSize}
                keyboard={false}>
                    {handleProductFunctions()}
                </Modal>
                :
                null
            }
        </>
    )
}

function ProductInventory (props){
    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            maxHeight: props.tableHeight,
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
            width: '13%'
        },
        //Sale Price
        col_3_width :{
            width: '13%'
        },
        //Cost
        col_4_width :{
            width: '10%'
        },
        //Invoice Number
        col_5_width :{
            width: '15%'
        },
        //Total Sale
        col_6_width :{
            width: '10%'
        },
        //Total Cost
        col_7_width :{
            width: '15%'
        },
        //Gross
        col_8_width :{
            width: '14%'
        }
    }

    return(
        <Table 
        striped 
        bordered 
        hover
        variant="dark"
        style={props.style}>
        <thead style={listingStyle.thead}>
            <tr style={listingStyle.tr}>
                <th style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{props.product.inventory_count}</th>
                <th style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Sale Price</th>
                <th style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Cost</th>
                <th style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Transactions</th>
                <th style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Received</th>
                <th style={{...listingStyle.col_6_width,...listingStyle.tdth}}>Initial Qt</th>
                <th style={{...listingStyle.col_7_width,...listingStyle.tdth}}>Supplier</th>
                <th style={{...listingStyle.col_8_width,...listingStyle.tdth}}>Invoice #</th>
            </tr>
        </thead>
        <tbody style={listingStyle.tbody}>
            {props.productInventory.map((inventory, index) => {
                return (
                    <tr key={index} style={listingStyle.tr}>
                        <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{inventory.current_quantity}</td>
                        <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>
                            <PopOverComponent 
                                inventory = {inventory}
                                index = {index}
                                column = {'sale_price'}
                            />
                        </td>
                        <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>
                            <PopOverComponent 
                                inventory = {inventory}
                                index = {index}
                                column = {'cost'}
                            />

                        </td>
                        <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>
                            {inventory.inventory_transactions.length} 
                                <Badge 
                                    onClick={() => {props.switchModalFunction('view-transactions', 'xl', inventory)}} 
                                    variant="warning"
                                    as="button"
                                    style={{float:'right'}}
                                >
                                    View
                                </Badge>
                        </td>
                        <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{inventory.receive_date}</td>
                        <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>{inventory.invoice_quantity}</td>
                        <td style={{...listingStyle.col_7_width,...listingStyle.tdth}}>{inventory.supplier_name}</td>
                        <td style={{...listingStyle.col_8_width,...listingStyle.tdth}}>{inventory.ap_invoice_number}</td>
                    </tr>
                )
            })}
        </tbody>
    </Table>
    )
}

function PopOverComponent (props){
    const inventoryContext = useContext(InventoryContext)
    const [currentValue, setCurrentValue] = useState(Number(props.inventory[props.column]).toFixed(2))
    const [newValue, setNewValue] = useState(Number(props.inventory[props.column]).toFixed(2))
    const [spinner, setSpinner] = useState(false)

    const handleSetNewValue = event => {
        event.preventDefault()
        setNewValue(event.target.value)
        console.log(event.target.value)
    }

    const submitNewValue = () =>{
        setSpinner(true)
        Api.updateInventory({
            id: props.inventory.id,
            updates: {
                [props.column]: Number(newValue).toFixed(2)
            }
        }).then( result => {
            setSpinner(false)
            setCurrentValue(Number(newValue).toFixed(2))
            document.body.click()
        }).catch( err => {
            console.log(err)
        })
    }

    const popover =(
            <Popover id={"popover"+props.index} style={popOverStyle} >
                <Popover.Content>
                    <Container fluid>
                        <Row>
                            <Col style={popOverStyle}>
                                    <label htmlFor={'new_'+props.column+props.index}>NEW {props.column.toUpperCase()}</label><br/>
                                    <input
                                        type="number"
                                        id={'new_'+props.column+props.index}
                                        value={newValue}
                                        onChange={(event)=>handleSetNewValue(event)}
                                    />
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            <Col>
                                <Button 
                                    disabled={newValue === ''? true:false}
                                    size="sm" 
                                    variant="success" 
                                    onClick={submitNewValue}
                                >
                                   {spinner? 
                                        <Spinner animation="border" role="status" size='sm'>
                                            <span className="sr-only">Loading...</span>
                                        </Spinner>
                                   :<>✓</>}
                                </Button>
                            </Col>
                            <Col></Col>
                            <Col><Button size="sm" variant="danger" onClick={()=>{document.body.click()}}>✗</Button></Col>
                        </Row>
                    </Container>
                </Popover.Content>
            </Popover>
        )

    return(
    <>
        {Number(currentValue) < Number(props.inventory.cost) && props.column === 'sale_price'?
            <span style={{color: 'red', fontWeight: 'bold'}}>${Number(currentValue).toFixed(2)}</span>
        :
            <span>${Number(currentValue).toFixed(2)}</span>
        }
        {inventoryContext.permission_level >= 2? 
            <OverlayTrigger trigger="click" placement="right" rootClose={true} overlay={popover}> 
                <Badge 
                    variant="warning"
                    as="button"
                    style={{float:'right'}}
                >
                    Edit
                </Badge>
            </OverlayTrigger>
        : null}
    </>
    )
}

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
                    <tr tr style={listingStyle.tr}>
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

export function ViewProductModal (props) {
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({modalType: undefined, modalSize: 'xl'})
    const [selectedInventory, setInventory] = useState(null)
    
    const collapseStyle = {
        width: '100%',
        maxHeight: '0px', 
        backgroundColor: 'grey', 
        overflow: 'hidden', 
        transition: 'max-height 0.2s ease-out'
    }

    const switchModalFunction = (modalType, modalSize, inventory) => {
        setInventory(inventory)
        setModalData({modalType: modalType, modalSize: modalSize})
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleCollapse = elId => {
        let elem = document.getElementById(elId)
        console.log('scroll height: '+elem.style.scrollHeight)
        if(elem.style.maxHeight != '0px'){
            elem.style.maxHeight = '0px'
        }else{
            elem.style.maxHeight = elem.scrollHeight+'px'
        }
    }

    const handleProductFunctions = () => {
        switch (modalData.modalType){
            case 'view-transactions':
                return(
                    <ViewTransactions
                        inventory = {selectedInventory}
                        closeModal = {closeModal}
                        product = {props.product}
                    />
                )
        }

    }
    return(
        <>
            <Modal.Header style={{display:'flex', justifyContent:'center'}}>
            <Modal.Title>{props.product.name_english.toUpperCase()} - Detailed View</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse0')}>Edit▼</Badge> <b>Name English:</b><span style={{float: 'right'}}>{props.product.name_english}</span>
                                    </div>
                                    <div id='collapse0' style={collapseStyle}>
                                        <InputGroup>
                                            <FormControl
                                            placeholder={props.product.name_english}
                                            aria-label="English Name"
                                            />
                                            <InputGroup.Append>
                                                <Button variant="success">✓</Button>
                                                <Button variant="danger">✗</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse1')}>Edit▼</Badge> <b>Name Chinese:</b><span style={{float: 'right'}}>{props.product.name_chinese}</span>
                                    </div>
                                    <div id='collapse1' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse2')}>Edit▼</Badge> <b>Category:</b><span style={{float: 'right'}}>{props.product.category}</span>
                                    </div>
                                    <div id='collapse2' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse3')}>Edit▼</Badge> <b>Holding:</b><span style={{float: 'right'}}>{props.product.holding}</span>
                                    </div>
                                    <div id='collapse3' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse4')}>Edit▼</Badge> <b>UPC:</b><span style={{float: 'right'}}>{props.product.upc}</span>
                                    </div>
                                    <div id='collapse4' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse5')}>Edit▼</Badge> <b>Location:</b><span style={{float: 'right'}}>{props.product.location}</span>
                                    </div>
                                    <div id='collapse5' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse6')}>Edit▼</Badge> <b>Weight:</b><span style={{float: 'right'}}>{props.product.weight} {props.product.measurement_system}</span>
                                    </div>
                                    <div id='collapse6' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse7')}>Edit▼</Badge> <b>Supplier 1:</b><span style={{float: 'right'}}>{props.product.supplier_primary_id}</span>
                                    </div>
                                    <div id='collapse7' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse8')}>Edit▼</Badge> <b>Supplier 2:</b><span style={{float: 'right'}}>{props.product.supplier_secondary_id}</span>
                                    </div>
                                    <div id='collapse8' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse9')}>Edit▼</Badge> <b>Supplier 3:</b><span style={{float: 'right'}}>{props.product.supplier_tertiary_id}</span>
                                    </div>
                                    <div id='collapse9' style={collapseStyle}>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item><b>Description:</b> {props.product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Accordion style={{width:'100%'}}>
                            <Accordion.Toggle as={Button} size='sm' variant='warning' eventKey="0">
                                <span style={{fontWeight: 'bold'}}>View Inventory ▼</span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <ProductInventory 
                                    product = {props.product}
                                    productInventory = {props.productInventory}
                                    switchModalFunction = {switchModalFunction}
                                    tableHeight = '200px'
                                    style={{marginTop: '5px'}}
                                />
                            </Accordion.Collapse>
                        </Accordion>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>

            {showModal?
                <Modal
                show={showModal}
                onHide={closeModal}
                backdrop="static"
                size={modalData.modalSize}
                keyboard={false}>
                    {handleProductFunctions()}
                </Modal>
                :
                null
            }
        </>
    )
}