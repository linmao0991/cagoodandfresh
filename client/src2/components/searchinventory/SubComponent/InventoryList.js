import React, {useState, useContext} from 'react';
import {Table, Modal, Spinner, Badge} from "react-bootstrap";
import {ViewInventoryModal, ViewProductModal} from '../../inventorymodals/index';
import Api from '../../../utils/Api';
import LoginContext from '../../../context/LoginContext'
import InventoryContext from '../../../context/InventoryContext'

function InventoryList (props){
    const loginContext = useContext(LoginContext)
    const inventoryContext = useContext(InventoryContext)
    const [modalShow, setModalShow] = useState(false)
    const [product, setProduct] = useState(undefined)
    const [productIndex, setProductIndex] = useState(undefined)
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
            width: '10%'
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
            width: '7%'
        },
        //Size
        col_7_width :{
            width: '7%'
        },
        //Location
        col_8_width :{
            width: '6%'
        },
        //UPC
        col_9_width :{
            width: '8%'
        }
    }

    const closeModal = () => {
        setModalShow(false)
    }

    const selectProduct = (product, modal, index) => {
        setProduct(product)
        setProductIndex(index)
        setDisplayType('loading')
        setModalShow(true)
        Api.getInventoryByProductID({
            productCode: product.id,
            //allInventory means get all inventory including 0 quantity left.
            allInventory: true,
        }).then( results => {
            inventoryContext.storeInventory(results.data)
            setDisplayType(modal)
        }).catch( err =>{
            console.log(err)
        })
    }

    const handleToggleModal = () =>{
        switch (displayType){
            case 'inventory':
                return(
                        <ViewInventoryModal 
                            product = {product}
                            productInventory = {inventoryContext.inventory}
                            handleClose = {closeModal}
                        />
                )
            case 'view product': 
                    return(
                        <ViewProductModal 
                            product = {product}
                            index = {productIndex}
                            productInventory ={inventoryContext.inventory}
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
                        <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}></td>
                        <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Inventory</td>
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
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>
                                    {loginContext.permissionLevel > 2? 
                                        <Badge variant='warning' as='button' style={{margin: 'auto'}} onClick={() => selectProduct(product, 'view product', index)}>Edit</Badge>
                                    : null}
                                </td>
                                <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>
                                    {product.inventory_count} <Badge variant='warning' as='button' style={{float: 'right'}} onClick={() => selectProduct(product, 'inventory')}>View</Badge></td>
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
                enforceFocus={false}
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