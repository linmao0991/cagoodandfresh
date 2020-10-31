import React, {useContext, useState}from 'react';
import {Button, Container, Row, Col, InputGroup, FormControl, DropdownButton, Dropdown} from "react-bootstrap";
import InventoryContext from '../../Context/InventoryContext';
import Api from '../../Utils/Api'
import InventoryList from './SubComponent/InventoryList';

function InventoryDisplay (){
    const inventoryContext = useContext(InventoryContext)

    const [dropDownTitle, setDropDownTitle] = useState("Category")
    const [displayType, setDisplayType] = useState(undefined)
    const [showDisplay, setShowDisplay] = useState(false)
    const [inventoryData, setInventoryData] = useState([])

    const getProductData = (category) =>{
        setShowDisplay(false)
        setDisplayType("category")
        setDropDownTitle(category.toUpperCase())
        Api.getProductsByCate({
            category: category
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
                        category = {dropDownTitle}
                    />
                )
            default:
                return(
                    null
                )
        }
    }

    return(
        <Container>
            <Row>
                <Col>
                    <InputGroup className="mb-3">
                        <FormControl
                        placeholder="Product Name or ID"
                        />
                        <InputGroup.Append>
                        <Button variant="outline-info">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Col>
                <Col>
                    <Button>All Products</Button>
                </Col>
                <Col>
                    <DropdownButton id="dropdown-item-button" title={dropDownTitle}>
                        {inventoryContext.categories.map((category, index) => {
                            return(
                                <Dropdown.Item key={index} onClick={() => getProductData(category)}>{category.toUpperCase()}</Dropdown.Item>
                            )
                        })}
                    </DropdownButton>
                </Col>
            </Row>
            <Row>
                {showDisplay?
                    InventoryDisplaySwitch()
                    :
                    null
                }
            </Row>
        </Container>
    )
}

export default InventoryDisplay