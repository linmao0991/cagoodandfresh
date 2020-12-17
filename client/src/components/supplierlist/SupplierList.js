import React, {useState, useRef} from 'react'
import {Table, Badge, Spinner, OverlayTrigger, Col, Button, Row, Popover, Container, InputGroup, FormControl} from 'react-bootstrap'
import API from '../../utils/Api'

const SupplierList = (props) => {
    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            height: "300px",
            borderStyle: 'solid',
            width: '100%'
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

    const searchInputRef = useRef(null) 
    const [loading, setLoading] = useState(false)
    const [supplierData, setSupplierData] = useState(null)

    const searchSupplierByInput = () => {
        setLoading(true)
        API.getSuppliersByInput({
            searchString: searchInputRef.current.value.trim()
        }).then( result => {
            setSupplierData(result.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const searchAllSuppliers = () => {
        setLoading(true)
        API.getAllSuppliers().then( result => {
            setSupplierData(result.data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        })
    }

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
                {supplierData?
                    <>
                    {supplierData.map((supplier, index) => {
                        return(
                            <tr key={index} style={listingStyle.tr}>
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>
                                    <PopOverComponent 
                                        supplier = {supplier}
                                        index = {index}
                                        updating = {props.updating}
                                        updateSupplier = {props.updateSupplier}
                                    />
                                </td>
                                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>{supplier.name_chinese}</td>
                                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{supplier.id}</td>
                                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{supplier.products}</td>
                            </tr>
                        )
                    })}
                    </>
                    :
                    loading?
                    <>
                        <tr style={listingStyle.tr}>
                            <td style={{width: '100%', textAlign: 'center'}}>
                                <Spinner animation="border" role="status" size='sm' style={{margin: '0 auto'}}>
                                <span className="sr-only">Loading...</span>
                                </Spinner>
                            </td>
                        </tr>
                    </>
                    :null
                }
            </tbody>
        </Table>
    </Row>
    </>
    )
}

export default SupplierList

function PopOverComponent (props){
    const popOverStyle = {
        backgroundColor: "#404040",
        color: "white",
        boarderStyle: 'solid',
        borderColor: 'gray',
        width: '500px'
    }

    const formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null
      }

    const popover =(
            <Popover id={"popover"+props.index} style={popOverStyle} >
                <Popover.Content>
                    <Container style={{color: 'white'}} fluid>
                        <Row style={{marginBottom: '2px'}}>
                            <Col>
                            <h6 style={{marginBottom: '0px'}}>{props.supplier.name_english} ({props.supplier.name_chinese})</h6>
                            <p>Supplier ID: {props.supplier.id}</p>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '2px'}}>
                            <Col>
                            <div style={{float: 'left', width: '70px'}}>
                                <b>Address:&nbsp;</b>
                            </div>
                            <div style={{float: 'left'}}>
                                <p style={{margin: 0}}>{props.supplier.billing_street}</p>
                                <p style={{margin: 0}}>{props.supplier.billing_city}, {props.supplier.billing_state} {props.supplier.billing_zipcode}</p>
                                <p style={{margin: 0}}>Phone: {formatPhoneNumber(props.supplier.business_phone_number)}</p>
                                <p style={{margin: 0}}>Fax: {formatPhoneNumber(props.supplier.fax_number)}</p>
                                <p style={{margin: 0}}>Email: {props.supplier.email? props.supplier.email: 'None'}</p>
                            </div>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '2px'}}>
                            <Col>
                            <div style={{float: 'left', width: '70px'}}>
                                <b>Contact:&nbsp;</b>
                            </div>
                            <div style={{float:'left'}}>
                                <p style={{margin: 0}}>{props.supplier.contact_first_name} {props.supplier.contact_last_name}</p>
                                <p style={{margin: 0}}>Phone: {formatPhoneNumber(props.supplier.contact_phone_number)}</p>
                            </div>
                            </Col>
                        </Row>
                        <Row style={{marginBottom: '2px'}}>
                            <Col>
                            <b style={{float: 'left', width: '70px'}}>Account#:&nbsp;</b>
                            <p style={{float:'left'}}>{props.supplier.account_number}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <b>Products:</b>
                                <p>{props.supplier.products}</p>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col>
                                <Button disabled={props.updating? true: false} style={{float: 'left'}} variant='success' onClick={() => {props.updateSupplier({id: props.supplier.id, name: props.supplier.name_english});document.body.click();}}>
                                    {props.updating?                     
                                        <Spinner animation="border" role="status" size='sm'>
                                            <span className="sr-only">Updating...</span>
                                        </Spinner>
                                        :
                                        'Select'
                                    }
                                </Button>
                                <Button style={{float: 'right'}} variant='danger' onClick={()=>{document.body.click()}}>Close</Button>
                            </Col>
                        </Row>
                    </Container>
                </Popover.Content>
            </Popover>
        )

    return(
    <>
        <OverlayTrigger trigger="click" placement="right" rootClose={true} overlay={popover}> 
            <Badge 
                variant="warning"
                as="button"
                style={{float:'right'}}
                disabled={props.updating? true: false}
            >
                View
            </Badge>
        </OverlayTrigger>
    </>
    )
}