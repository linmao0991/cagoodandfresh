import React,{useState, useContext} from 'react';
import {Container, Row, Col, Button, Spinner, Modal} from 'react-bootstrap';
import InventorySearch from '../inventorySearch/InventorySearch';
import InventoryContext from '../../context/InventoryContext';
import ProductInventory from '../productinventory/ProductInventory'
import ViewTransactions from '../viewtransactions/ViewTransactions'
import AddInventoryRecord from '../addInventoryRecord/AddInventoryRecord'
import API from '../../utils/Api'
import './addInventory.css'

const AddInventory = () => { 
    const inventoryContext = useContext(InventoryContext);
    const [resultDisplay, setResultDisplay] = useState(null)
    const [productDisplay,setProductDisplay] = useState()
    const [activeProduct, setActiveProduct] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState(null)

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
                setProductDisplay('display-product')
            }).catch( err => {
                console.log(err)
            })
        }).catch( err =>{
            console.log(err)
        })
    }

    const switchModalData = (modalFunc, modalSize, data) => {
        setModalData({function: modalFunc, size: modalSize, data: data})
        setShowModal(true)
    }

    const toggleModal = () =>{
        setShowModal(!showModal)
    }

    const productDisplaySwitch = () => {
        switch (productDisplay){
            case 'display-product':
                return(
                    <Row>
                        <ProductInventory 
                            switchModalFunction = {switchModalData}
                            tableHeight = '500px'
                        />
                    </Row>
                )
            case 'loading':
                return(
                    <Row className="justify-content-md-center" style={{paddingTop: '20px'}}>
                        <Spinner animation="border" role="status" size='lg'>
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                )
            default:
                return(
                    null
                )
        }
    }

    const modalSwitchFunc = () => {
        console.log(`Show ${modalData.function}, ${showModal}`)
        switch (modalData.function){
            case 'view-transactions':
                return(
                    <ViewTransactions
                        inventory = {modalData.data}
                        closeModal ={toggleModal}
                        product = {inventoryContext.selectedProduct}
                    />
                )
            case 'add-inventory-record':
                return(
                    <AddInventoryRecord
                        suppliers = {inventoryContext.productSuppliers}
                        closeModal ={toggleModal}
                        product = {inventoryContext.selectedProduct}
                    />
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
                    <Row className="justify-content-md-center">
                        <Spinner animation="border" role="status" size='lg'>
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Row>
                )
            case 'display-result':
                return(
                    <div
                        style = {{
                            height: '600px',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            border: 'solid',
                            borderWidth: '1px'
                        }}
                    >
                        {inventoryContext.products.map((product,index) => {
                            return(
                                <div key={index}
                                    className = 'listed-product'
                                    style={{
                                        padding: '5px',
                                        backgroundColor: activeProduct===index?'#5f5f5f':null,
                                        borderRadius: '5px',
                                        marginBottom: '2px'
                                    }}
                                    onClick = {() => handleSelectedProduct(product,index)}
                                ><span style={{display: 'inline'}}>{activeProduct===index?'► ':null}</span>
                                <h6 style={{display: 'inline'}}>{product.name_english}</h6></div>
                            )
                        })}
                    </div>
                )
            default:
                return(
                    <></>
                )
        }
    }

    return(
        <>
        <Container fluid>
            <Row>
                <Col md={4} lg={4}>
                    <InventorySearch
                        toggleLoading = {() => setResultDisplay('loading')}
                        toggleLoaded = {() => setResultDisplay('display-result')}
                    />
                    {inventoryContext.products? 
                        searchResultComponentSwitch()
                    :null}
                </Col>
                <Col>
                    <Row className= 'justify-content-md-center' style={{borderBottom: '1px solid white', paddingBottom: '15px'}}>
                        <Col>
                            <Button 
                                disabled={productDisplay==='display-product'?false:true}
                                variant='warning'
                                onClick={() => switchModalData('add-inventory-record', 'xl')}
                            >
                                Add Inventory
                            </Button>
                        </Col>
                        <Col style={{textAlign: 'center'}}>
                            {productDisplay==='display-product' && inventoryContext.selectedProduct?
                                <h6 style={{margin: '0px'}}>{inventoryContext.selectedProduct.name_english}</h6>
                                :
                                null
                            }
                        </Col>
                        <Col></Col>
                    </Row>
                    {inventoryContext.selectedProduct?
                        productDisplaySwitch()
                        :null}
                </Col>
            </Row>
        </Container>

        {showModal?
            <Modal
            show={showModal}
            onHide={toggleModal}
            backdrop="static"
            size={modalData.size}
            keyboard={false}>
                {modalSwitchFunc()}
            </Modal>
            :
            null
        }
        </>
    )
}

export default AddInventory;