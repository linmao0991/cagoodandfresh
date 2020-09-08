import React, {useState}from 'react';
import {Container, Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import Api from '../../Utils/Api';

function SearchProduct (){
    const [searchInput, setSearchInput] = useState("")

    const handleSearchInput = (event) => {
        event.preventDefault()
        setSearchInput(event.target.value);
        console.log(searchInput)
    }

    return (
        <>
        <Row>
            <InputGroup
                onChange={event => handleSearchInput(event)}
            >
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Product Name"
                    aria-label="product"
                    aria-describedby="product-search"
                />
            </InputGroup>
        </Row>
        <Row>

        </Row>
        </>
    )
}

export default SearchProduct;