import React, {useState, useContext} from 'react';
import {Modal, Button, Container, Badge, Row, Col, 
        ListGroup, Accordion} from 'react-bootstrap';
import EditProductSupplier from '../editproductsupplier/EditProductSupplier';
import EditProductDetail from '../editproductdetail/EditProductDetail';
import InventoryContext from '../../context/InventoryContext';
import ViewTransactions from '../viewtransactions/ViewTransactions'
import ProductInventory from '../productinventory/ProductInventory';

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

export function ViewProductModal (props) {
    const inventoryContext = useContext(InventoryContext)
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState({modalType: undefined, modalSize: 'xl',  modalStyle: null})
    const [selectedInventory, setInventory] = useState(null)
    console.log(inventoryContext.productSuppliers)
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
        setModalData({modalType: modalType, modalSize: modalSize, modalStyle: null})
        setShowModal(true)
    }

    const editSupplier = (modalType, modalSize, supplierIndex, supplier, index) => {
        console.log([modalType, modalSize, supplierIndex, supplier, index])
        setModalData(undefined)
        setModalData({
            modalStyle: {borderStyle: 'solid', borderColor: 'white'},
            modalType: modalType,
            modalSize: modalSize,
            modalCentered: true,
            data: {
                supplierTier: supplierIndex,
                //index of product in products array located at InventoryContext
                //--Needed for updating context
                index: index,
                supplierData: supplier
            }
        })
        console.log(modalData)
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
        console.log(modalData)
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
                        modalStyle = {modalData.modalStyle}
                        supplier_tier = {modalData.data.supplierTier}
                        product = {productDetails}
                        supplierData = {modalData.data.supplierData}
                        index = {modalData.data.index}
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
                                {inventoryContext.productSuppliers.map( (supplier, supplierIndex) => {
                                    return(
                                        <ListGroup.Item key={supplierIndex}>
                                            <div style={{margin: '2px'}}>
                                                <Badge 
                                                    variant='warning'
                                                    size='sm' as='button' 
                                                    onClick={() => editSupplier('edit-supplier','xl',supplierIndex,supplier, props.index)}
                                                >Edit<b>+</b>
                                                </Badge>&nbsp;<b>Supplier 1:</b><span style={{float: 'right'}}>{supplier? supplier.name_english: 'None'}</span>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })
                                }
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