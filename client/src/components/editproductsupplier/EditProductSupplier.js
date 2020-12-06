import React, {useState, useRef, useContext} from 'react';
import {Row, Col, Modal, Button, Container, InputGroup, FormControl, Spinner, Badge} from 'react-bootstrap';
import API from '../../utils/Api'
import SupplierList from '../../components/supplierlist/SupplierList'
import InventoryContext from '../../context/InventoryContext'

const EditProductSupplier = (props) =>{
    const colStyle = {
        backgroundColor: '#404040',
        borderStyle: 'solid',
        borderWidth: '1px'
    }

    const rowStyle = {
        marginBottom: '2px'
    }

    const supplierTier = ['Primary Supplier','Secondary Supplier','Tertiary Supplier']
    const supplierFieldName = ['supplier_primary_id','supplier_secondary_id','supplier_tertiary_id']

    const modalStyle = {backgroundColor: '#595959'}

    const inventoryContext = useContext(InventoryContext)
    const searchInputRef = useRef(null)
    const [contentData, setContentData] = useState(null)
    const [contentType, setContentType] = useState('supplier-display')
    const [supplierLoading, setSupplierLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    let supplier = inventoryContext.productSuppliers[props.supplierIndex]

    const searchSupplierByInput = () => {
        setSupplierLoading(true)
        API.getSuppliersByInput({
            searchString: searchInputRef.current.value.trim()
        }).then( result => {
            setContentData(result.data)
            setSupplierLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const searchAllSuppliers = () => {
        setSupplierLoading(true)
        API.getAllSuppliers().then( result => {
            setContentData(result.data)
            setSupplierLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const updateProductField = (fieldValue) => {
        setUpdating(true)
        setContentType('updating-supplier')
        API.updateProduct({
            id: props.product.id,
            update: {[supplierFieldName[props.supplierIndex]]: fieldValue}
        }).then(result => {
            let updatedProduct = result.data[0]
            let updatedProducts = [...inventoryContext.products]
            updatedProducts.splice(props.productIndex,1,updatedProduct)
            inventoryContext.storeProducts(updatedProducts)
            API.getProductSuppliers({
                supplier_ids: [updatedProduct.supplier_primary_id,updatedProduct.supplier_secondary_id,updatedProduct.supplier_tertiary_id]
            }).then( result => {
                inventoryContext.storeSelectedProduct(updatedProduct)
                inventoryContext.storeProductSuppliers(result.data)
            }).catch( err => {
                console.log(err)
            })
            setContentType('supplier-display')
            setUpdating(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null
      }

    const contentSwitchHandler = (contentType, data) => {
        switch (contentType){
            case 'updating-supplier':
                return(
                    <Container>
                        <Row>
                            <Col>
                                <Spinner animation="border" role="status" size='lg'>
                                    <span className="sr-only">Loading...</span>
                                </Spinner><span>Updating Supplier...</span>
                            </Col>
                        </Row>
                    </Container>
                )
            case 'supplier-display':
                return(
                    <>
                    {data?
                        <>
                        <Row className='md-1' style={rowStyle}>
                            <Col>Supplier ID</Col>
                            <Col style={colStyle}>{data.id}</Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Name</Col>
                            <Col style={colStyle}>{data.name_english} ({data.name_chinese})</Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Address</Col>
                            <Col style={colStyle}>
                                <p style={{margin: 0}}>{data.billing_street}</p>
                                <p style={{margin: 0}}>{data.billing_city}, {data.billing_state} {data.billing_zipcode}</p>
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Busness Phone</Col>
                            <Col style={colStyle}><p style={{margin: 0}}>{formatPhoneNumber(data.business_phone_number)}</p></Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Busness Fax</Col>
                            <Col style={colStyle}><p style={{margin: 0}}>{formatPhoneNumber(data.fax_number)}</p></Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Busness Email</Col>
                            <Col style={colStyle}><p style={{margin: 0}}>{data.email? data.email: 'None'}</p></Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Contact</Col>
                            <Col style={colStyle}>
                                <p style={{margin: 0}}>{data.contact_first_name} {data.contact_last_name}</p>
                                <p style={{margin: 0}}>Phone: {formatPhoneNumber(data.contact_phone_number)}</p>
                            </Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Account Number</Col>
                            <Col style={colStyle}><p>{data.account_number}</p></Col>
                        </Row>
                        <Row style={rowStyle}>
                            <Col>Products</Col>
                        </Row>
                        <Row>
                            <Col style={colStyle}>
                            {data.products.toUpperCase()}
                            </Col>
                        </Row>
                        </>
                            :
                            'No Supplier'
                        }
                    </>
                )
            case 'search-suppliers':
                return(
                    <>
                    <Row noGutters={true}>
                        <Col>
                            <InputGroup style={{padding: '4px'}}>
                                <FormControl
                                    placeholder="Supplier Name, Product Categories, or ID"
                                    ref={searchInputRef}
                                />
                                <InputGroup.Append>
                                    <Button variant="info" onClick={searchSupplierByInput}>Search</Button>
                                </InputGroup.Append>
                                <InputGroup.Append>
                                    <Button variant="info" onClick={searchAllSuppliers}>All Suppliers</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        <SupplierList 
                            supplierData = {contentData}
                            loading = {supplierLoading}
                            updating = {updating}
                            updateSupplier = {updateProductField}
                        />
                    </Row>
                    </>
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <>
        <Modal.Header closeButton style={modalStyle}>
        <Modal.Title>Edit {supplierTier[props.supplierIndex]}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyle}>
            <Container fluid>
                <Row>
                    <Col lg={4} md={4}>
                        <Row>
                            <Col>
                                <h6 style={{display: 'inline-block', margin: 'auto'}}><b>Current Supplier:</b></h6>
                                <span style={{display: 'inline-block', float: 'right'}}>
                                    <Badge variant='warning' size='sm' as='button' onClick={() => updateProductField(null)}>
                                        Remove
                                    </Badge>
                                </span>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>
                                {contentSwitchHandler(contentType, supplier)}
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={8} md={8}>
                        <Row className='mb-1'>
                            <Col>
                                <b>Search Suppliers:</b>
                            </Col>
                        </Row>
                        {contentSwitchHandler('search-suppliers', contentData)}
                    </Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer style={modalStyle}>
            <Button variant="secondary" onClick={props.closeModal}>
                Close
            </Button>
        </Modal.Footer>
        </>
    )
}

export default EditProductSupplier