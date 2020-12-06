import React, {useContext, useState}from 'react';
import {Button, Container, Row, Col, DropdownButton, Dropdown, Spinner} from "react-bootstrap";
import InventoryContext from '../../context/InventoryContext';
import Api from '../../utils/Api'
import InventoryList from './subcomponent/InventoryList';
import InventorySearch from '../inventorySearch/InventorySearch';

function SearchInventory (props){
    const inventoryContext = useContext(InventoryContext)
    const [searchTitle, setSearchTitle] = useState(undefined)
    const [showDisplay, setShowDisplay] = useState(false)

    const getProductByCate = (searchType, searchData) =>{
        setShowDisplay('loading')
        setSearchTitle(searchData.toUpperCase())
        Api.getProductsByCate({
                searchType: searchType,
                searchData: searchData
            }
        ).then( products => {
            inventoryContext.storeProducts(products.data)
            setShowDisplay(true)
        }).catch(err => {
            console.log("something went wrong")
        })
    }

    const getAllProducts = () =>{
        setShowDisplay('loading')
        setSearchTitle('All Products')
        Api.getAllProducts({
        }).then( products => {
            inventoryContext.storeProducts(products.data)
            setShowDisplay(true)
        }).catch(err => {
            console.log(err)
            console.log("something went wrong")
        })
    }

    const InventoryDisplaySwitch = () => {
        switch (showDisplay){
            case true:
                return(
                    <InventoryList 
                        inventoryData = {inventoryContext.products}
                        category = {searchTitle}
                    />
                )
            case 'loading':
                return(
                    <Spinner animation="border" role="status" size='lg'>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <Container fluid>
            <Row>
                <Col>
                    <InventorySearch
                        toggleLoading = {() => setShowDisplay('loading')}
                        toggleLoaded = {() => setShowDisplay(true)}
                        returnInput = {setSearchTitle}
                    />
                </Col>
                <Col>
                    <Button style={{display: 'inline-block'}} variant='warning' onClick={() => getAllProducts()}>All Products</Button>&nbsp;
                    <DropdownButton style={{display: 'inline-block'}} variant='warning' id="dropdown-item-button" title="Category">
                        {inventoryContext.categories.map((category, index) => {
                            return(
                                <Dropdown.Item 
                                    key={index} 
                                    onClick={() => getProductByCate('category',category)}
                                >
                                    {category.toUpperCase()}
                                </Dropdown.Item>
                            )
                        })}
                    </DropdownButton>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign: 'center'}}>
                    <h4>{searchTitle? searchTitle: null}</h4>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                {showDisplay?
                    InventoryDisplaySwitch()
                    :
                    null
                }
            </Row>
        </Container>
    )
}

export default SearchInventory