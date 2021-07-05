import React, {useContext, useState, useEffect} from 'react';
import { Modal, Button, Container, Row, Col , Spinner, InputGroup, FormControl} from 'react-bootstrap';
import API from '../../utils/Api';
import InventoryContext from '../../context/InventoryContext'
import InventorySearch from '../../components/inventorySearch/InventorySearch'
import './addInventoryItem.css'

const AddInventoryRecord = (props) => {

    const inventoryContext = useContext(InventoryContext)
    const [resultDisplay, setResultDisplay] = useState(null)
    const [productDisplay,setProductDisplay] = useState()
    const [activeProduct, setActiveProduct] = useState(null)
    const [itemDetail, setItemDetail] = useState(null)
    const [addingItem, setAddingItem] = useState(false)

    const validateItemDetails = () => {
        setAddingItem(true)
        console.log('Validate Item Details')
        let inputValues = ["invoice-quantity","sale-price","cost"]
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
            props.addInvoiceItem(itemDetail)
            setItemDetail({
                ...itemDetail,
                product_code: undefined,
                name_english: undefined,
                name_chinese: undefined,
                upc: undefined,
                invoice_quantity: undefined,
                cost: undefined,
                sale_price: undefined 
            })
            inventoryContext.storeSelectedProduct(undefined)
            setAddingItem(false)
        }else{
            setAddingItem(false)
        }
    }

    const handleSelectedProduct = (product, productIndex) => {
        setActiveProduct(productIndex)
        setProductDisplay('loading')
        inventoryContext.storeSelectedProduct(product)
        API.getInventoryByProductID({
            productCode: product.id,
            //allInventory means get all inventory including 0 quantity left.
            allInventory: true,
        }).then( results => {
            inventoryContext.storeInventory(results.data)
            API.getProductSuppliers({
                supplier_ids: [product.supplier_primary_id,product.supplier_secondary_id,product.supplier_tertiary_id]
            }).then( result => {
                inventoryContext.storeProductSuppliers(result.data)
                setItemDetail({
                    ...itemDetail,
                    //Same as product.id
                    product_code: product.id,
                    name_english: product.name_english,
                    name_chinese: product.name_chinese,
                    upc: product.upc,
                    cost: undefined,
                    sale_price: undefined,
                    invoice_quantity: undefined,
                    //ap_invoice_number is the same as newInvoiceDetails.invoice_number      
                })
                setProductDisplay('display-product')
            }).catch( err => {
                console.log(err)
            })
        }).catch( err =>{
            console.log(err)
        })
    }

    const handleInputchange = e => {
        let fieldName = e.target.id.replace(/-/g,'_')
        setItemDetail({...itemDetail, [fieldName]: e.target.value})
    }

    const loadingSpinner = (size, style) => {
        return(
            <Spinner animation="border" role="status" size={size} style={style? style :{left: '45%', top: '50%', margin: '0px', position: 'absolute'}}>
                <span className="sr-only">Loading...</span>
            </Spinner>)
        }

    const productDisplaySwitch = () => {
        switch (productDisplay){
            case 'display-product':
                return(
                    <>
                        <Row>
                            <Col><h5>{inventoryContext.selectedProduct.name_english}</h5></Col>
                        </Row>
                        <Row xs={1} md={1} lg={2}>
                            <Col>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>ID</b>:&nbsp;</p>
                                    <span style={{display: 'inline', float: 'right'}}>{inventoryContext.selectedProduct.id}</span>
                                </div>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>Holding</b>:&nbsp;</p>
                                    <span style={{display: 'inline',float: 'right'}}>{inventoryContext.selectedProduct.holding.toUpperCase()}</span>
                                </div>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>Location</b>:&nbsp;</p>
                                    <span style={{display: 'inline', float: 'right'}}>{inventoryContext.selectedProduct.location.toUpperCase()}</span>
                                </div>
                            </Col>
                            <Col>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>Category</b>:&nbsp;</p>
                                    <span style={{display: 'inline', float: 'right'}}>{inventoryContext.selectedProduct.category.toUpperCase()}</span>
                                </div>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>Weight</b>:&nbsp;</p>
                                    <span style={{display: 'inline',float: 'right'}}>{inventoryContext.selectedProduct.weight}&nbsp;{inventoryContext.selectedProduct.measurement_system.toUpperCase()}</span>
                                </div>
                                <div className='product-detail-row'>
                                    <p style={{display:'inline'}}><b>UPC</b>:&nbsp;</p>
                                    <span style={{display: 'inline', float: 'right'}}>{inventoryContext.selectedProduct.upc}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col>
                            <p style={{marginBottom: '0px', paddingLeft: '6px'}}><b>Description</b>:&nbsp;</p>
                            <div className='product-detail-row'>
                                <p>{inventoryContext.selectedProduct.description}</p>
                            </div>
                            </Col>
                        </Row>
                        <Row xs={1} md={1} lg={2}>
                            <Col className='invoice-item-input-column'>
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Quantity</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    placeholder="0"
                                    aria-label="Quantity"
                                    type="number"
                                    aria-describedby="inventory-item-quantity"
                                    id="invoice-quantity"
                                    onChange={(e) => handleInputchange(e)}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Cost</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    placeholder="0.00"
                                    aria-label="Cost"
                                    aria-describedby="inventory-item-cost"
                                    type="number"
                                    id="cost"
                                    onChange={(e) => handleInputchange(e)}
                                    />
                                </InputGroup> 
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Sale Price</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    placeholder="0.00"
                                    aria-label="Sale Price"
                                    type="number"
                                    aria-describedby="inventory-item-sale_price"
                                    id="sale-price"
                                    onChange={(e) => handleInputchange(e)}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Supplier</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    style={{backgroundColor:'#4d4b4b'}}
                                    disabled
                                    placeholder={
                                        inventoryContext.newInvoiceDetails.supplier_name?
                                        inventoryContext.newInvoiceDetails.supplier_name:
                                        "None"}
                                    aria-label="Supplier"
                                    aria-describedby="inventory-item-supplier"
                                    id="inventory-item-supplier"
                                    />
                                </InputGroup> 
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Total Cost</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    style={{backgroundColor:'#4d4b4b'}}
                                    disabled
                                    placeholder={
                                        itemDetail.cost && itemDetail.invoice_quantity?
                                        `$${(+itemDetail.cost*+itemDetail.invoice_quantity).toFixed(2)}`:
                                        "Enter Cost and Quantity"}
                                    aria-label="Supplier"
                                    aria-describedby="total-cost"
                                    id="inventory-item-total-cost"
                                    />
                                </InputGroup> 
                            </Col>
                            <Col className="mb-2">
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Lot Number</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    placeholder="0"
                                    aria-label="Lot Number"
                                    type="text"
                                    aria-describedby="lot-number"
                                    id="lot"
                                    onChange={(e) => handleInputchange(e)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </>
                )
            case 'loading':
                return(
                    <Row className="justify-content-md-center">
                        {loadingSpinner('lg')}
                    </Row>
                )
            default:
                return(
                    null
                )
        }
    }

    const searchResultComponentSwitch = () =>{
        switch (resultDisplay){
            case 'loading':
                return(
                    loadingSpinner('lg')
                )
            case 'display-result':
                return(
                    inventoryContext.products.map((product,index) => {
                        return(
                            <div key={index}
                                className = 'listed-product'
                                style={{
                                    padding: '5px',
                                    backgroundColor: activeProduct===index?'#5f5f5f':null,
                                    borderRadius: '5px',
                                    marginBottom: '2px'
                                }}
                                onClick = {activeProduct===index?null:() => handleSelectedProduct(product,index)}
                            ><span style={{display: 'inline'}}>{activeProduct===index?'► ':null}</span>
                            <h6 style={{display: 'inline'}}>{product.name_english}</h6></div>
                        )
                    })
                )
            default:
                return(
                    <></>
                )
        }
    }

    useEffect(() => {
        console.log(['Set default item details'])
        let defaultDetails = {
            //Same as product.id
            purchase_order_number: inventoryContext.newInvoiceDetails.purchase_order_number,
            //ap_invoice_number is the same as newInvoiceDetails.invoice_number
            ap_invoice_number: inventoryContext.newInvoiceDetails.ap_invoice_number,
            receive_date: inventoryContext.newInvoiceDetails.receive_date,
            supplier_id: inventoryContext.newInvoiceDetails.supplier_id,
            supplier_name: inventoryContext.newInvoiceDetails.supplier_name,
            product_code: undefined,
            name_english: undefined,
            name_chinese: undefined,
            upc: undefined,
            invoice_quantity: undefined,
            cost: undefined,
            sale_price: undefined
        }
        setItemDetail({...defaultDetails})
    }, [
        //ap_invoice_number is the same as newInvoiceDetails.invoice_number
        inventoryContext.newInvoiceDetails.ap_invoice_number,
        inventoryContext.newInvoiceDetails.receive_date,
        inventoryContext.newInvoiceDetails.supplier_id,
        inventoryContext.newInvoiceDetails.supplier_name,
        inventoryContext.newInvoiceDetails.purchase_order_number,
    ])

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Add Item To Invoice</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid style={{marginBottom: '10px'}}>
                    <Row xs={1} md={1} lg={2}>
                        <Col md={6} lg={4}>
                            <InventorySearch
                                toggleLoading = {() => setResultDisplay('loading')}
                                toggleLoaded = {() => setResultDisplay('display-result')}
                            />
                            <div id="add-inventory-item-search-result">
                               {searchResultComponentSwitch()}
                            </div>
                        </Col>
                        <Col md={6} lg={8}>
                            {inventoryContext.selectedProduct?
                            productDisplaySwitch()
                            :null}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Container fluid>
                    <Row>
                        <Col>
                            <Button 
                            variant="secondary" 
                            onClick={props.closeModal}
                            disabled ={addingItem? true: false}
                            style={{width: '50%', float: "left"}}
                            >
                                Close
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="warning" onClick={validateItemDetails} style={{width: '50%', float: "right"}}>
                                {addingItem? loadingSpinner('sm', {margin: 'auto'}): 'Add Item'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </>
    )
}

export default AddInventoryRecord;