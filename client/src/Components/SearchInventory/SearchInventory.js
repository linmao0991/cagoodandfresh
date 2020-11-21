import React, {useContext, useState, useRef}from 'react';
import {Button, Container, Row, Col, InputGroup, FormControl, DropdownButton, Dropdown, Spinner} from "react-bootstrap";
import InventoryContext from '../../Context/InventoryContext';
import Api from '../../Utils/Api'
import InventoryList from './SubComponent/InventoryList';

function SearchInventory (){
    const inventoryContext = useContext(InventoryContext)
    const searchInputRef = useRef(null)
    const [searchTitle, setSearchTitle] = useState(undefined)
    const [displayType, setDisplayType] = useState(undefined)
    const [showDisplay, setShowDisplay] = useState(false)
    const [inventoryData, setInventoryData] = useState([])

    const getProductByCate = (searchType, searchData) =>{
        setShowDisplay('loading')
        setDisplayType("category")
        setSearchTitle(searchData.toUpperCase())
        Api.getProductsByCate({
                searchType: searchType,
                searchData: searchData
            }
        ).then( products => {
            console.log(products.data)
            setInventoryData(products.data)
            setShowDisplay(true)
        }).catch(err => {
            console.log("something went wrong")
        })
    }

    const searchProductByInput = () => {
        setShowDisplay('loading')
        setSearchTitle(searchInputRef.current.value.trim())
        Api.searchInventoryByInput({
            searchInput: searchInputRef.current.value.trim()
        }).then(products => {
            console.log(products.data)
            setInventoryData(products.data)
            setShowDisplay(true)
        })
    }

    const getAllProducts = () =>{
        setShowDisplay('loading')
        setSearchTitle('All Products')
        Api.getAllProducts({
        }).then( products => {
            console.log(products.data)
            setInventoryData(products.data)
            setShowDisplay(true)
        }).catch(err => {
            console.log("something went wrong")
        })
    }

    const InventoryDisplaySwitch = () => {
        switch (showDisplay){
            case true:
                return(
                    <InventoryList 
                        inventoryData = {inventoryData}
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
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Product Name or ID"
                            ref={searchInputRef}
                        />
                        <InputGroup.Append>
                        <Button variant="outline-info" onClick={searchProductByInput}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
                <Col>
                    <Button style={{display: 'inline-block'}} variant='secondary' onClick={() => getAllProducts()}>All Products</Button>{' '}
                    <DropdownButton style={{display: 'inline-block'}} variant='secondary' id="dropdown-item-button" title="Category">
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
                    </DropdownButton>{' '}
                </Col>
                <Col>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign: 'center'}}>
                    <h4>{searchTitle? searchTitle: null}</h4>
                </Col>
            </Row>
            <br/>
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