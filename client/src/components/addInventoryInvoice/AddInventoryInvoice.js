import React,{useState, useContext, Suspense, useEffect} from 'react';
import {Container, Row, Col, Button, Spinner, Modal, InputGroup, FormControl, Badge, Accordion, Card} from 'react-bootstrap';
import InventoryContext from '../../context/InventoryContext';
import API from '../../utils/Api'
import './addInventoryInvoice.css'
const AddInventoryItem = React.lazy(() => import('../addInventoryItem/AddInventoryItem'));
const SupplierList = React.lazy(() => import('../supplierlist/SupplierList'))

const AddInventoryInvoice = () => {
    const inventoryContext = useContext(InventoryContext);
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [addItemLoading, setAddItemLoading] = useState(false)

    const modalSwitchFunction = () => {
        switch (modalData.type){
            case 'add-new-item':
                return(
                    <Suspense fallback={
                        loadingSpinner
                    }>
                        <AddInventoryItem
                            addInvoiceItem = {addInvoiceItem}
                            closeModal = {() => setShowModal(false)}
                        />
                    </Suspense>
                )
            case 'search-supplier':
                return(
                    <>
                    <Modal.Header closeButton>
                        <Modal.Title>Search Suppliers</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Suspense fallback={loadingSpinner}>
                                <SupplierList 
                                    updateSupplier = {selectSupplier}
                                />
                            </Suspense>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                    </>
                )
            default:
                return(
                    null
                )
        }
    }

    const addInvoiceItem = item => {
        let newInvoiceItems = [...inventoryContext.newInvoiceItems]
        newInvoiceItems.push(item)
        inventoryContext.storeNewInvoiceItems(newInvoiceItems)
    }

    const selectSupplier = supplier => {
        let newInvoiceDetails = {...inventoryContext.newInvoiceDetails}
        newInvoiceDetails.supplier_id = supplier.id
        newInvoiceDetails.supplier_name = supplier.name
        inventoryContext.storeNewInvoiceDetails(newInvoiceDetails)
        // document.getElementById('supplier-name').value = supplier.name
        setShowModal(false)
    }

    const checkInvDetails = () => {
        setAddItemLoading(true)
        let inputValues = ["invoice-number","supplier-name","receive-date"]
        let checkInputValues = [];
        inputValues.forEach(inputValue => {
            if(document.getElementById(inputValue).value === undefined
            || document.getElementById(inputValue).value === null
            || document.getElementById(inputValue).value === ''){
                document.getElementById(inputValue).style.borderColor = 'red';
                document.getElementById(inputValue).style.borderStyle = 'solid';
                document.getElementById(inputValue).style.borderWidth = '2px';
                checkInputValues.push(false)
            }else{
                document.getElementById(inputValue).style.removeProperty('border-color')
                document.getElementById(inputValue).style.removeProperty('border-style')
                document.getElementById(inputValue).style.removeProperty('border-width')
            }
        })
        if(checkInputValues.every(value => {return value? true: false})){
            setAddItemLoading(false)
            handleModelSwitch('add-new-item','xl')
        }else{
            setAddItemLoading(false)
        }
    }

    const loadingSpinner = <Spinner animation="border" role="status" size='sm'>
        <span className="sr-only">Loading...</span>
        </Spinner>

    const handleModelSwitch = (type, size, data) => {
        setModalData({
            type:type,
            size:size?size:'lg',
            data: data?data:null
        })
        setShowModal(true)
    }

    const removeItem = (item, index) =>{
        let newInvoiceItems = [...inventoryContext.newInvoiceItems]
        newInvoiceItems.splice(index, 1)
        inventoryContext.storeNewInvoiceItems(newInvoiceItems)
    }

    const handleInputchange = e => {
        let newInvoiceDetails = {...inventoryContext.newInvoiceDetails}
        let fieldName = e.target.id.replace(/-/g,'_')
        newInvoiceDetails[fieldName] = e.target.value
        inventoryContext.storeNewInvoiceDetails(newInvoiceDetails)
    }

    const updateInvoiceTotal = invoiceTotal => {
        let newInvoiceDetails = {...inventoryContext.newInvoiceDetails, invoice_total: invoiceTotal}
        inventoryContext.storeNewInvoiceDetails(newInvoiceDetails)
    }

    //Runs if there is a change in newInvoiceItems context
    //--Will always run when switchig to different sub directories
    useEffect(()=> {
        //If newInvoiceItems array has items, calculates new invoice total using array.
        if(Array.isArray(inventoryContext.newInvoiceItems) && 
            inventoryContext.newInvoiceItems.length > 0){
            let invoiceTotal = inventoryContext.newInvoiceItems.reduce((accumulator, currentValue) => {
                return accumulator+(+currentValue.cost*+currentValue.invoice_quantity)
            }, 0)
            updateInvoiceTotal(invoiceTotal)
        }
        //If newInvoiceItems is an array and has length of 0
        if(Array.isArray(inventoryContext.newInvoiceItems) &&
            inventoryContext.newInvoiceItems.length === 0){
            let invoiceTotal = 0
            updateInvoiceTotal(invoiceTotal)
        }
    }, [inventoryContext.newInvoiceItems])

    return(
        <>
        <Container fluid>
            <Row className='justify-content-md-center' sm={1} md={2} lg={2}>
                <Col className='invoice-detail-column' md={6} lg={4}>
                    <Row>  
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Invoice Number</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={inventoryContext.newInvoiceDetails.invoice_number}
                            placeholder="Invoice Number"
                            aria-label="Invoice Number"
                            aria-describedby="invoice-number"
                            id="invoice-number" 
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup>     
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>PO Number</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={inventoryContext.newInvoiceDetails.purchase_order_number}
                            id="purchase-order-number"
                            placeholder="PO Number"
                            aria-label="PO Number"
                            aria-describedby="po-number"
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup>   
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <Button 
                                    variant='warning' 
                                    style={{width: '140px', fontWeight: 'bold', textAlign: 'left'}}
                                    onClick={() => handleModelSwitch('search-supplier','xl')}
                                    >Search</Button>
                            </InputGroup.Prepend>
                            <FormControl
                            style={{backgroundColor:'#4d4b4b', color: 'white'}}
                            disabled
                            value={inventoryContext.newInvoiceDetails.supplier_name}
                            id="supplier-name"
                            placeholder="Select a Supplier"
                            aria-label="Supplier"
                            aria-describedby="supplier-name"
                            >
                            </FormControl>
                            <InputGroup.Append>
                                <InputGroup.Text 
                                    style={{
                                        backgroundColor:inventoryContext.newInvoiceDetails.supplier_name?'yellowgreen':"Red", 
                                        fontWeight: 'bold',
                                        color: 'white'}}
                                >
                                   {inventoryContext.newInvoiceDetails.supplier_name?'✓':'X'}
                                </InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>   
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Invoice Total</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            style={{backgroundColor:'lightgrey'}}
                            disabled
                            value={`$${inventoryContext.newInvoiceDetails.invoice_total.toFixed(2)}`}
                            id="invoice-total"
                            placeholder="$0.00"
                            type='text'
                            aria-label="Invoice Total"
                            aria-describedby="invoice-total"
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup>   
                    </Row>
                </Col>
                <Col className='invoice-detail-column' md={6} lg={4}>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Receive Date</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            id="receive-date"
                            value={inventoryContext.newInvoiceDetails.receive_date}
                            placeholder="MM/DD/YYYY"
                            aria-label="Receive Date"
                            aria-describedby="receive-date"
                            type='date'
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup> 
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Due Date</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            id="due-date"
                            value={inventoryContext.newInvoiceDetails.due_date}
                            placeholder="MM/DD/YYYY"
                            aria-label="Due Date"
                            aria-describedby="due-date"
                            type='date'
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup>
                    </Row>
                    <Row>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Paid Amount</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                            value={inventoryContext.newInvoiceDetails.paid_amount}
                            placeholder="$0.00"
                            aria-label="Paid Amount"
                            aria-describedby="paid-amount"
                            type='number'
                            id="paid-amount"
                            onChange={(e) => handleInputchange(e)}
                            />
                        </InputGroup> 
                    </Row>
                    <Row>
                        <Button variant='warning' style={{width: '100%'}} onClick={()=>checkInvDetails('add-new-item','xl')}>
                            {addItemLoading? loadingSpinner: 'Add Invoice Item'}
                        </Button>
                    </Row>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col className='invoice-item-list'>
                    <Row>
                        <Col>
                            <div className="invoice-item-titles-container" style={{display: 'flex', padding: '0px'}}>
                                <div className="invoice-item-container-titles" style={{width: '30%'}}>Name English</div>
                                <div className="invoice-item-container-titles" style={{width: '30%'}}>Name Chinese</div>
                                <div className="invoice-item-container-titles" style={{width: '10%'}}>Quantity</div>
                                <div className="invoice-item-container-titles" style={{width: '10%'}}>Cost</div>
                                <div className="invoice-item-container-titles" style={{width: '10%'}}>Lot#</div>
                                <div className="invoice-item-container-titles" style={{width: '10%'}}></div>
                            </div>
                        </Col>
                    </Row>
                    {inventoryContext.newInvoiceItems?
                        inventoryContext.newInvoiceItems.map((item, index) => {
                            return(
                                <Row key={index}>
                                    <Col>
                                        <div className="invoice-item-container"style={{display: 'flex'}}>
                                            <div style={{display:"inline-block", width: '30%', padding: '2px 2px 2px 5px'}}>{item.name_english}</div>
                                            <div style={{display:"inline-block", width: '30%', padding: '2px 2px 2px 5px'}}>{item.name_chinese}</div>
                                            <div style={{display:"inline-block", width: '10%', padding: '2px 2px 2px 5px', textAlign: "center"}}>{item.invoice_quantity}</div>
                                            <div style={{display:"inline-block", width: '10%', padding: '2px 2px 2px 5px', textAlign: "center"}}>${(+item.cost).toFixed(2)}</div>
                                            <div style={{display:"inline-block", width: '10%', padding: '2px 2px 2px 5px', textAlign: "center"}}>{item.lot}</div>
                                            <div style={{display:"inline-block", padding: '2px 2px 2px 5px', margin: 'auto'}}><Badge variant='danger' as='button' size-='sm' onClick={() => removeItem(item, index)}>Remove</Badge></div>
                                        </div>
                                    </Col>
                                </Row>
                            )
                        })
                    :
                    <Row className='justify-content-md-center'>
                        <Col style={{textAlign: 'center'}}>No Items</Col>
                    </Row>
                    }
                </Col>
                <Col className='invoice-item-list-mobile'>
                    {inventoryContext.newInvoiceItems?
                        <Accordion style={{width: '100%'}}>
                            {inventoryContext.newInvoiceItems.map((item, index) => {
                                return(
                                    <Card key={`m-${index}`}
                                    style={{backgroundColor: '#333333', borderColor: 'black', color: 'white'}}>
                                        <Accordion.Toggle 
                                        as={Card.Header} 
                                        eventKey={`${index}`} 
                                        style={{backgroundColor: '#d39e00', color: 'black', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                            {item.invoice_quantity} - {item.name_english}
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={`${index}`}>
                                            <Card.Body>
                                                <Row style={{marginBottom: '5px', borderBottom: '1px solid grey', paddingBottom: '5px'}}><Col xs={5}>Name English:</Col><Col>{item.name_english}</Col></Row>
                                                <Row style={{marginBottom: '5px', borderBottom: '1px solid grey', paddingBottom: '5px'}}><Col xs={5}>Name Chinese:</Col><Col>{item.name_chinese}</Col></Row>
                                                <Row style={{marginBottom: '5px', borderBottom: '1px solid grey',paddingBottom: '5px'}}><Col xs={5}>Quantity:</Col><Col>{item.invoice_quantity}</Col></Row>
                                                <Row style={{marginBottom: '5px', borderBottom: '1px solid grey',paddingBottom: '5px'}}><Col xs={5}>Cost:</Col><Col>${(+item.cost).toFixed(2)}</Col></Row>
                                                <Row style={{marginBottom: '5px', borderBottom: '1px solid grey',paddingBottom: '5px'}}><Col xs={5}>Lot#:</Col><Col>{item.lot}</Col></Row>
                                                <Row><Col><Badge variant='danger' as='button' size-='sm' onClick={() => removeItem(item, index)}>Remove</Badge></Col></Row>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                            })}
                        </Accordion>
                    :
                    <Row className='justify-content-md-center'>
                        <Col style={{textAlign: 'center'}}>No Items</Col>
                    </Row>
                    }
                </Col>
            </Row>
        </Container>

        {showModal?
            <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            size={modalData.size}
            keyboard={false}>
                {modalSwitchFunction()}
            </Modal>
            :
            null
        }
        </>
    )
}

export default AddInventoryInvoice;