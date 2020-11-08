import React, {useState} from 'react';
import {Button,Table, Modal, Spinner} from "react-bootstrap";
import {ViewProductModal, ViewTransactionModal} from '../../InventoryModals/index';
import Api from '../../../Utils/Api'

function InventoryList (props){

    const [modalShow, setModalShow] = useState(false)
    const [product, setProduct] = useState(undefined)
    const [productInventory, setInventory] = useState(undefined)
    const [displayType, setDisplayType] =useState(undefined)

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
        //Button
        col_1_width :{
            width: '6%'
        },
        //Stock
        col_2_width :{
            width: '4%'
        },
        //Name English
        col_3_width :{
            width: '23%'
        },
        //Name Chinese
        col_4_width :{
            width: '23%'
        },
        //Category
        col_5_width :{
            width: '10%'
        },
        //Holding
        col_6_width :{
            width: '9%'
        },
        //Size
        col_7_width :{
            width: '7%'
        },
        //Location
        col_8_width :{
            width: '8%'
        },
        //UPC
        col_9_width :{
            width: '10%'
        }
    }

    const closeModal = () => {
        setModalShow(false)
    }

    const selectProduct = product => {
        setProduct(product)
        setDisplayType('loading')
        setModalShow(true)
        Api.getInventoryByProductID({
            productCode: product.id
        }).then( results => {
            setInventory(results.data)
            setTimeout(() => {
                setDisplayType('product')
        },1000)
        }).catch( err =>{
            console.log(err)
        })
    }

    const handleToggleModal = () =>{
        console.log(productInventory)
        switch (displayType){
            case 'product':
                return(
                        <ViewProductModal 
                            product = {product}
                            productInventory = {productInventory}
                            handleClose = {closeModal}
                        />
                )
            case 'loading':
                return(
                    <>
                        <Modal.Header style={{display:'flex', justifyContent:'center'}}>
                            <Modal.Title>{product.name_english}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="lg"
                                    role="status"
                                    aria-hidden="true"
                                    variant="light"
                                >
                                </Spinner>
                            </div>
                        </Modal.Body>
                    </>
                )
            default:
                return(null)
        }
    }

    return( 
        <>   
            <Table
                striped 
                bordered 
                hover
                variant="dark"
            >
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{props.category.toUpperCase()}</td>
                        <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Stock</td>
                        <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Product Name English</td>
                        <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Product Name Chinese</td>
                        <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Category</td>
                        <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>Holding</td>
                        <td style={{...listingStyle.col_7_width,...listingStyle.tdth}}>Size</td>
                        <td style={{...listingStyle.col_8_width,...listingStyle.tdth}}>Location</td>
                        <td style={{...listingStyle.col_9_width,...listingStyle.tdth}}>UPC</td>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {props.inventoryData.map((product, index) => {
                        return(
                            <tr key={index} style={listingStyle.tr}>
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}><Button size="sm" onClick={() => selectProduct(product)} variant="outline-success">Select</Button></td>
                                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>{product.inventory_count}</td>
                                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{product.name_english}</td>
                                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{product.name_chinese}</td>
                                <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{product.category}</td>
                                <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>{product.holding}</td>
                                <td style={{...listingStyle.col_7_width,...listingStyle.tdth}}>{product.weight} {product.measurement_system}</td>
                                <td style={{...listingStyle.col_8_width,...listingStyle.tdth}}>{product.location}</td>
                                <td style={{...listingStyle.col_9_width,...listingStyle.tdth}}>{product.upc}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            {modalShow?
                <Modal
                show={modalShow}
                onHide={closeModal}
                backdrop="static"
                size="xl"
                keyboard={false}>
                    {handleToggleModal()}
                </Modal>
                :
                null
            }
        </>
    )
}

export default InventoryList