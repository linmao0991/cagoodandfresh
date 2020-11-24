import React, {useState, useContext} from 'react';
import {Modal, Button, InputGroup, FormControl, 
        Table, Container, Badge, Card, Popover, 
        OverlayTrigger, Row, Col, Spinner, 
        ListGroup, Accordion, Dropdown, DropdownButton} from 'react-bootstrap';
import Api from '../../utils/Api'
import InventoryContext from '../../context/InventoryContext';

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
            default:
                return(null)
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
            Api.getInventoryByProductID({
                productCode: props.inventory.product_code,
                //allInventory means get all inventory including 0 quantity left.
                allInventory: true,
            }).then( results => {
                inventoryContext.storeInventory(results.data)
                setSpinner(false)
                setCurrentValue(Number(newValue).toFixed(2))
                document.body.click()
            }).catch( err =>{
                console.log(err)
            })
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

function EditProductSupplier (props) {
    return(
        <>
        <Modal.Header closeButton>
            <Modal.Title>Edit Product Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container fluid>
                <Row>
                    <Col>Current Supplier: <span>{props.fieldValue}</span></Col>
                </Row>
                <Row>
                    <Col>New Supplier</Col>
                </Row>
            </Container>
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
    const inventoryContext = useContext(InventoryContext)
    //const [productDetails, setProductDetails] = useState(inventoryContext.products[props.index])
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({modalType: undefined, modalSize: 'xl'})
    const [selectedInventory, setInventory] = useState(null)
    
    let productDetails = inventoryContext.products[props.index]

    const collapseStyle = {
        width: '100%',
        maxHeight: '0px', 
        backgroundColor: 'grey', 
        overflow: 'hidden', 
        transition: 'max-height 0.2s ease-out'
    }

    const viewTransactions = (modalType, modalSize, inventory) => {
        setInventory(inventory)
        setModalData({modalType: modalType, modalSize: modalSize})
        setShowModal(true)
    }

    const editSupplier = (modalType, modalSize, fieldName, fieldValue, index) => {
        setModalData({
            modalType: modalType,
            modalSize: modalSize,
            modalCentered: true,
            data: {
                //field name in db
                fieldName: fieldName,
                //field value in db
                fieldValue: fieldValue,
                //index of product in products array located at InventoryContext
                //--Needed for updating context
                index: index
            }
        })
        setShowModal(true)

    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleCollapse = elId => {
        let elem = document.getElementById(elId)
        if(elem.style.maxHeight !== '0px'){
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
                        product = {productDetails}
                    />
                )
            case 'edit-supplier':
                return(
                    <EditProductSupplier
                        fieldName = {modalData.data.fieldName}
                        product = {productDetails}
                        fieldValue = {modalData.data.fieldValue}
                        index = {modalData.index}
                        closeModal = {closeModal}
                    />
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <>
            <Modal.Header style={{display:'flex', justifyContent:'center'}}>
            <Modal.Title>{productDetails.name_english.toUpperCase()} - Detailed View</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse0')}>Edit▼</Badge>&nbsp;<b>Name English:</b><span style={{float: 'right'}}>{productDetails.name_english}</span>
                                    </div>
                                    <div id='collapse0' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'name_english'
                                            label = 'English Name'
                                            placeholder = {productDetails.name_english}
                                            id = {productDetails.id}
                                            divId = 'collapse0'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse1')}>Edit▼</Badge>&nbsp;<b>Name Chinese:</b><span style={{float: 'right'}}>{productDetails.name_chinese}</span>
                                    </div>
                                    <div id='collapse1' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'name_chinese'
                                            label = 'Chinese Name'
                                            placeholder = {productDetails.name_chinese}
                                            id = {productDetails.id}
                                            divId = 'collapse1'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <span style={{float: 'left'}}>
                                        <EditProductDetail
                                            field = 'category'
                                            label = 'Categry'
                                            placeholder = {productDetails.category}
                                            id = {productDetails.id}
                                            //divId = 'collapse1'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        /></span>&nbsp;<b>Category:</b>
                                        <span style={{float: 'right'}}>{productDetails.category.toUpperCase()}</span>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <span style={{float: 'left'}}>
                                        <EditProductDetail
                                            field = 'holding'
                                            label = 'Holding'
                                            placeholder = {productDetails.holding}
                                            id = {productDetails.id}
                                            //divId = 'collapse1'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        /></span>&nbsp;<b>Holding:</b><span style={{float: 'right'}}>{productDetails.holding.toUpperCase()}</span>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse4')}>Edit▼</Badge>&nbsp;<b>UPC:</b><span style={{float: 'right'}}>{productDetails.upc}</span>
                                    </div>
                                    <div id='collapse4' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'upc'
                                            label = 'UPC'
                                            placeholder = {productDetails.upc}
                                            id = {productDetails.id}
                                            divId = 'collapse4'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse5')}>Edit▼</Badge>&nbsp;<b>Location:</b><span style={{float: 'right'}}>{productDetails.location}</span>
                                    </div>
                                    <div id='collapse5' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'location'
                                            label = 'Location'
                                            placeholder = {productDetails.location}
                                            id = {productDetails.id}
                                            divId = 'collapse5'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse6')}>Edit▼</Badge>&nbsp;<b>Weight:</b><span style={{float: 'right'}}>{productDetails.weight} {productDetails.measurement_system}</span>
                                    </div>
                                    <div id='collapse6' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'weight'
                                            label = 'Weight'
                                            placeholder = {productDetails.weight}
                                            id = {productDetails.id}
                                            divId = 'collapse6'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => editSupplier('edit-supplier','lg','supplier_primary_id',productDetails.supplier_name, props.index)}>Edit▼</Badge>&nbsp;<b>Supplier 1:</b><span style={{float: 'right'}}>{productDetails.supplier_primary_id}</span>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse8')}>Edit▼</Badge>&nbsp;<b>Supplier 2:</b><span style={{float: 'right'}}>{productDetails.supplier_secondary_id}</span>
                                    </div>
                                    <div id='collapse8' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'supplier_secondary_id'
                                            label = 'Supplier'
                                            placeholder = {productDetails.supplier_secondary_id}
                                            id = {productDetails.id}
                                            divId = 'collapse8'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse9')}>Edit▼</Badge>&nbsp;<b>Supplier 3:</b><span style={{float: 'right'}}>{productDetails.supplier_tertiary_id}</span>
                                    </div>
                                    <div id='collapse9' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'supplier_tertiary_id'
                                            label = 'Supplier'
                                            placeholder = {productDetails.supplier_tertiary_id}
                                            id = {productDetails.id}
                                            divId = 'collapse9'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div style={{margin: '2px'}}>
                                        <Badge variant='warning' size='sm' as='button' onClick={() => handleCollapse('collapse10')}>Edit▼</Badge>&nbsp;<b>Description:</b> {productDetails.description}
                                    </div>    
                                    <div id='collapse10' style={collapseStyle}>
                                        <EditProductDetail 
                                            field = 'description'
                                            label = 'Description'
                                            placeholder = {productDetails.description}
                                            id = {productDetails.id}
                                            divId = 'collapse10'
                                            collapse = {handleCollapse}
                                            index = {props.index}
                                        />
                                    </div>
                                </ListGroup.Item>
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
                                    switchModalFunction = {viewTransactions}
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
                centered={modalData.modalCentered?true:false}
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

export function EditProductDetail (props){
    const inventoryContext = useContext(InventoryContext)
    const [inputValue, setInputValue] = useState(props.placeholder)
    const [loading, setLoading] = useState(false)
    //const [show, setShow] = useState(false);

    //const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    const inputHandler = value => {
        setInputValue(value)
    }

    const updateProductField = (value) => {
        let fieldValue;
        if(value){
            fieldValue = value
        }else{
            fieldValue = inputValue
        }
        console.log('update')
        setLoading(true)
        console.log('[Submit Input]: '+fieldValue)
        Api.updateProduct({
            id: props.id,
            update: {[props.field]: fieldValue}
        }).then(result => {
            let updatedProducts = [...inventoryContext.products]
            updatedProducts.splice(props.index,1,result.data[0])
            inventoryContext.storeProducts(updatedProducts)
            setLoading(false)
            if(props.divId){
                props.collapse(props.divId)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Badge
            disabled={loading?true:false}
            variant='warning' 
            size='sm' 
            as='button'
            href=""
            ref={ref}
            onClick={(e) => {
            e.preventDefault();
            onClick(e);
            }}
        >
            {loading?
                <Spinner animation="border" role="status" size='sm'>
                    <span className="sr-only">Loading...</span>
                </Spinner>
            :
                <>{children}&#x25bc;</>
            }
        </Badge>
    ));

    const switchFieldUpdate = () =>{
        switch(props.field){
            case 'name_chinese':
            case 'name_english':
            case 'weight':
            case 'location':
            case 'upc':
            case 'description':
                return(
                    <InputGroup>
                        <FormControl
                        value={inputValue}
                        aria-label={props.label}
                        onChange={(event) => inputHandler(event.target.value)}
                        />
                        <InputGroup.Append>
                            <Button variant="success" onClick={() => updateProductField()}>
                                {loading?
                                <Spinner animation="border" role="status" size='sm'>
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                :
                                <>✓</>
                                }
                            </Button>
                            <Button variant="danger" disabled={loading?true:false} onClick={() => props.collapse(props.divId)}>✗</Button>
                        </InputGroup.Append>
                    </InputGroup>
                )
            case 'category':
                return(
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} >Edit</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {inventoryContext.categories.map((category, index) => {
                            return(
                            <Dropdown.Item
                                key={category+''+index}
                                eventKey={category+''+index}
                                onClick={() =>{
                                    updateProductField(category)
                                }}
                            >
                                {category.toUpperCase()}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                )
            case 'holding':
                return(
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} >Edit</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {['refrigeration','frozen','dry'].map((holding, index) => {
                            return(
                            <Dropdown.Item
                                key={holding+''+index}
                                eventKey={holding+''+index}
                                onClick={() =>{
                                    updateProductField(holding)
                                }}
                            >
                                {holding.toUpperCase()}
                            </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <>
            {switchFieldUpdate()}
        </>
    )
}