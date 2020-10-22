import React, {Component}from 'react';
import {Container, Row, InputGroup, FormControl, Spinner} from 'react-bootstrap';
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
                <Container>
                    <InputGroup
                        onChange={event => this.handleSearchInput(event)}
                    >
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1" style={{width:"100px"}}>
                                {this.state.searching? 
                                <>
                                <span>Search&nbsp;</span>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    variant="success"
                                />
                                </>
                                : "Search"}
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Product Name"
                            aria-label="product"
                            aria-describedby="product-search"
                        />
                    </InputGroup>
                </Container>
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