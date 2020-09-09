import React, {Component}from 'react';
import {Container, Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import Api from '../../Utils/Api';
import OrderContext from '../../Context/OrderContext';
import ProductListing from '../../Components/ProductListing/ProductListing';

class SearchProduct extends Component{
    state = {
        searchInput: "",
        renderResults: false,
        resultData: [],
        searching: false,
    }

    static contextType = OrderContext;

    handleSearchInput = (event) => {
        event.preventDefault()
        this.setState({
            searchInput: event.target.value,
        })
        if(event.target.value.length > 1){
            this.setState({searching: true})
            Api.searchInventoryByInput({
                searchInput: event.target.value
            }).then(result => {
                this.context.storeCategorySelection("search", result.data,"search")
                console.log(result.data)
                this.setState({
                    resultData: result.data,
                    renderResults: true,
                    searching: false,
                })
            })
        }
        console.log(this.state.searchInput)
    }

    render(){
        return (
            <>
            <Row>
                <InputGroup
                    onChange={event => this.handleSearchInput(event)}
                >
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                            {this.state.searching? "Searching...": "Search\xa0\xa0\xa0\xa0\xa0\xa0"}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Product Name"
                        aria-label="product"
                        aria-describedby="product-search"
                    />
                </InputGroup>
            </Row>
            <br/>
            <Row>
                {this.state.renderResults? 
                    <Container fluid>
                        <ProductListing 
                            allProductData = {this.context.productData}
                            categorySelection = {this.context.categorySelection.toUpperCase()}
                        />
                    </Container>
                : null}
            </Row>
            </>
        )
    }
}

export default SearchProduct;