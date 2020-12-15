import React,{useState, useContext, useRef, useEffect} from 'react';
import {Container, Row, Col, Button, Spinner, Modal, InputGroup, FormControl, Dropdown, DropdownButton} from 'react-bootstrap';
import AddInventoryItem from '../addInventoryItem/AddInventoryItem';
import InventoryContext from '../../context/InventoryContext';
import API from '../../utils/Api'
import './addInventoryInvoice.css'

//Creating new inventory operation order
//--Create accounts_payable_invoices record
//--Create new inventory record for each item using accounts_payable_invoices.id

const AddInventoryInvoice = () => {
    const inputRef = useRef(null)
    const inventoryContext = useContext(InventoryContext);
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState(null)
    // const [screenWidth, setScreenWidth] =useState(null)
    // const [screenHeight, setScreenHeight] = useState(null)
    // const [itemListPos, setitemListPos] =useState(null)
    const [itemListStyle, setitemListStyle] = useState(null)
    const [addItemLoading, setAddItemLoading] = useState(false)

    const modalSwitchFunction = () => {
        switch (modalData.type){
            case 'add-new-item':
                return(
                    <AddInventoryItem
                        closeModal = {() => setShowModal(false)}
                    />
                )
            default:
                return(
                    null
                )
        }
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

    const handleInputchange = e => {
        let newInvoiceDetails = {...inventoryContext.newInvoiceDetails}
        console.log(e.target.value)
        let fieldName = e.target.id.replace(/-/g,'_')
        newInvoiceDetails[fieldName] = e.target.value
        inventoryContext.storeNewInvoiceDetails(newInvoiceDetails)
        console.log(inventoryContext.newInvoiceDetails)
    }

    // useEffect(() => {
    //     const heightHandler = (size) => {
    //         setScreenHeight(size)
    //     }

    //     const widthHandler = (size) =>{
    //         setScreenWidth(size)
    //     }

    //     window.addEventListener('resize',() => {
    //         if(window.innerHeight !== screenHeight){
    //             heightHandler(window.innerHeight)
    //         }
    //         if(window.innerWidth !== screenHeight){
    //             widthHandler(window.innerHeight)
    //         }
    //     })
    // })

    // useEffect(()=>{
    //     const handleItemListPos = (innerHeight) => {
    //         let itemListPos = document.querySelector('.invoice-item-list').getBoundingClientRect()
    //         let elHeight = innerHeight - itemListPos.y
    //         console.log(elHeight)
    //         setitemListStyle({height: `${elHeight-20}px`, backgroundColor: 'black'})
    //     }

    //     window.addEventListener('resize',() => {
    //         handleItemListPos(window.innerHeight)
    //     });
    // },[])

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
                            <InputGroup.Prepend
                                id='supplier-input-group-dropdown'
                            >
                                {/* <InputGroup.Text>Supplier</InputGroup.Text> */}
                                <DropdownButton
                                as={InputGroup.Prepend}
                                variant="secondary"
                                title="Supplier"
                                id="input-group-dropdown"
                                >
                                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup.Prepend>
                            <FormControl
                            id="supplier-name"
                            placeholder="Supplier"
                            aria-label="Supplier"
                            aria-describedby="supplier-name"
                            onChange={(e) => handleInputchange(e)}
                            >
                            </FormControl>
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
                            id="invoice-total"
                            placeholder="$0.00"
                            aria-label="Invoice Total"
                            aria-describedby="invoice-total"
                            type='number'
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
                            placeholder="0.00"
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
                <Col className='invoice-item-list' style={itemListStyle}>
                    {inventoryContext.newInvoiceItems?
                        inventoryContext.newInvoiceItems.map((item, index) => {
                            return(
                                <div key={index}>{item.name_english}</div>
                            )
                        })
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