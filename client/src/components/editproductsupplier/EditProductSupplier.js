import React, {useState, useRef} from 'react';
import {Row, Col, Modal, Button, Container, InputGroup, FormControl} from 'react-bootstrap';
import API from '../../utils/Api'
import SupplierList from '../../components/supplierlist/SupplierList'

const EditProductSupplier = (props) =>{
    let modalStyle = {backgroundColor: '#595959'}
    const searchInputRef = useRef(null)
    const [contentType, setContentType] = useState('search-suppliers')
    const [contentData, setContentData] = useState(null)
    const [supplierLoading, setSupplierLoading] = useState(false)

    const searchSupplierByInput = () => {
        setSupplierLoading(true)
        API.getSuppliersByInput({
            searchString: searchInputRef.current.value.trim()
        }).then( result => {
            console.log(result.data)
            setContentData(result.data)
            setSupplierLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const searchAllSuppliers = () => {
        setSupplierLoading(true)
        API.getAllSuppliers().then( result => {
            console.log(result)
            setContentData(result.data)
            setSupplierLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const contentSwitchHandler = (contentType, data) => {
        switch (contentType){
            case 'supplier-display':
                return(
                    <>
                    {data?
                        <>
                        <Row className='md-1'>
                            <Col>Supplier ID</Col>
                            <Col>{data.id}</Col>
                        </Row>
                        <Row>
                            <Col>Name</Col>
                            <Col>{data.name_english} ({data.name_chinese})</Col>
                        </Row>
                        <Row>
                            <Col>Address</Col>
                            <Col>
                                <p style={{margin: 0}}>{data.billing_street}</p>
                                <p style={{margin: 0}}>{data.billing_city}, {data.billing_state} {data.billing_zipcode}</p>
                                <p style={{margin: 0}}>Phone: {data.business_phone_number}</p>
                                <p style={{margin: 0}}>Fax: {data.fax_number}</p>
                                <p style={{margin: 0}}>Email: {data.email}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>Contact</Col>
                            <Col>
                                <p style={{margin: 0}}>{data.contact_first_name} {data.contact_last_name}</p>
                                <p style={{margin: 0}}>Phone: {data.contact_phone_number}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>Account Number</Col>
                            <Col><p>{data.account_number}</p></Col>
                        </Row>
                        <Row>
                            <Col>Products</Col>
                            <Col><p>{data.products}</p></Col>
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
                        <Col md={9} lg={9} className="mr-1">
                            <InputGroup>
                                <FormControl
                                    placeholder="Supplier Name, Product Categories, or ID"
                                    ref={searchInputRef}
                                />
                                <InputGroup.Append>
                                <Button variant="info" onClick={searchSupplierByInput}>Search</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button variant="info" onClick={searchAllSuppliers}>All Suppliers</Button>
                        </Col>
                    </Row>
                    <Row>
                        <SupplierList 
                            supplierData = {contentData}
                            loading = {supplierLoading}
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
            <Modal.Title>Edit Product Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyle}>
            <Container fluid>
                <Row>
                    <Col lg={4} md={4}>
                        <Row>
                            <Col>
                                <b>Current Supplier:</b>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {contentSwitchHandler('supplier-display', props.supplierData)}
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={8} md={8}>
                        <Row className='mb-1'>
                            <Col>
                                <b>New Supplier:</b>
                            </Col>
                        </Row>
                        {contentSwitchHandler(contentType, contentData)}
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