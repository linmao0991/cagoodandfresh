import React, {useState} from "react";
import {Button, Container, Row, Col} from "react-bootstrap";
import SearchInventory from '../../components/searchinventory/SearchInventoryMain';
import AddInventory from '../../components/addInventory/AddInventory';
//import InventoryContext from '../../context/InventoryContext'

const Inventory = ()=>{
    //const inventoryContext = useContext(InventoryContext)
    const [displayType, setDisplayType] = useState(null)

    const selectInventoryFunc = (func) => {
        setDisplayType(func)
        // inventoryContext.storeProducts(undefined)
        // inventoryContext.storeInventory(undefined)
        // inventoryContext.storeProductSuppliers(undefined)
        // inventoryContext.storeSelectedProduct(undefined)
    }

    const switchDisplay = () => {
        switch(displayType){
            case 'Search-Inventory':
                return(
                    <SearchInventory />
                )
            case 'Add-Inventory':
                return(
                    <AddInventory />
                )
            default:
                return(
                    <></>
                )
        }
    }

    return(
        <Container fluid>
            <Row>
                <Col>
                    <Button variant={displayType === 'Search-Inventory'?'warning':'info'} onClick={()=> selectInventoryFunc('Search-Inventory')}>Search Inventory</Button>&nbsp;
                    <Button variant={displayType === 'Add-Inventory'?'warning':'info'} onClick={()=> selectInventoryFunc('Add-Inventory')}>Add Inventory</Button>&nbsp;
                    <Button variant={displayType === 'Add-Product'?'warning':'info'} onClick={()=> selectInventoryFunc('Add-Product')}>Add New Product</Button>&nbsp;
                </Col>
            </Row>
            <br />
            <Row>
                {switchDisplay()}
            </Row>
        </Container>
    )
}

export default Inventory;