import React, {useContext, useState} from "react";
import {Modal, Container, Row, Col, Button, Table, InputGroup, FormControl} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function AddProductModal (props) {
    const orderContext = useContext(OrderContext);
    const setInitialCount = () =>{
        let initialCountState = []
        for (let [index, inventory] of props.productInven.entries()){
            initialCountState.push({index: index, quantity: 0, newSalePrice: parseFloat(inventory.sale_price).toFixed(2), inventory: inventory})
        }
        return initialCountState;
    }

    const [show, toggleShow] = useState(props.show);
    const [count, setCount] = useState(setInitialCount());
    const [totalCount, setTotalCount] = useState(undefined)
    const [totalSale, setTotalSale] = useState(undefined)

    //Function to add selected product into the cart then stores updated cart to OrderContext
    const addProductToCart = (event) => {
        event.preventDefault()
        //Create new object with combined product data and inventory data
        let newCartItems = 
            count.map(item => {
                let cartItem ={
                    ...props.productData,
                    quantity: item.quantity,
                    sale_price: item.newSalePrice,
                    cost: item.inventory.cost,
                    inventory_id: item.inventory.id,
                    ar_invoice_number: item.inventory.ar_invoice_number,
                    supplier_name: item.inventory.supplier_name,
                    supplier_id: item.inventory.supplier_id
                }
                if(item.quantity>0){
                    return cartItem
                }
            }).filter(cartItem =>{
                return(cartItem? cartItem: null)
            })
        //Add new cart item to the existing cart
        let cart = [...orderContext.cartData,...newCartItems]
        // Store the updated cart to OrderContext
        orderContext.storeCart(cart)
        // Calls the toggleShow function in the parent component ProductListing to hide the modal
        props.toggleShow(!show)
    }

    //Sets the item count by manual input and calculates...
    //...new total count and sales then sets the state
    const handleSetCount = (index, event) => {
        event.preventDefault()
        let newState = [...count]
        newState[index].quantity = parseFloat(event.target.value)
        calculateTotals(newState)
        setCount(newState)
    }

    //Sets the sale price of current item and calculates...
    //...new total count and sales then sets the states
    const handleSetNewSalePrice = (index, event) => {
        event.preventDefault()
        let newState = [...count]
        newState[index].newSalePrice = event.target.value
        calculateTotals(newState)
        setCount(newState)
    }

    //Increments and decrements the item count using the...
    //...+,- buttons on either side of the input. Then
    // checks to make sure amout is not less than 0
    // before updating total count, sales, and sets the states
    const handleCountIncDec = (index, value, event)=>{
        event.preventDefault()
        let newState =[...count]
        let currentItemCount = newState[index].quantity
        let changeValue = parseFloat(value)
        if(currentItemCount+changeValue >= 0){
            newState[index].quantity = newState[index].quantity + value
            calculateTotals(newState)
            setCount(newState)
        }
    }

    //Takes in current basket and calculates total count and sales, then set state
    const calculateTotals = (newState) => {
        let newTotalCount = newState.reduce((accumulator, currentValue) => {return accumulator + currentValue.quantity},0)
        let newTotalSales = newState.reduce((accumulator, currentValue) => {return accumulator + (currentValue.quantity * currentValue.newSalePrice)},0)
        setTotalCount(newTotalCount)
        setTotalSale(newTotalSales.toFixed(2))
    }

    return(
        <>
        <Modal
            size="lg"
            show={show}
            onHide={props.toggleShow}
            backdrop="static"
            keyboard={false}
            key={props.productInven.id}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.productData.name_english}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Table 
                        striped 
                        bordered 
                        hover
                        variant="dark">
                        <colgroup>
                            <col style={{width: "20%"}}/>
                            <col style={{width: "10%"}}/>
                            <col style={{width: "15%"}}/>
                            <col style={{width: "15%"}}/>
                            <col style={{width: "15%"}}/>
                            <col style={{width: "25%"}}/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Count</th>
                                <th>Sale Price</th>
                                <th>Cost</th>
                                <th>Received</th>
                                <th>Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.productInven.map((inventory, index) => {
                                return (
                                    <tr key={index}>
                                        <td><InputGroup
                                                key={index}
                                            >
                                                <InputGroup.Prepend>
                                                    <Button size="sm" variant="outline-success" onClick={(event)=>handleCountIncDec(index, -1, event)}>-</Button>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    value={count[index].quantity? count[index].quantity: 0}
                                                    onChange={(event)=>handleSetCount(index, event)}
                                                    placeholder=""
                                                    aria-label="product-count"
                                                    type="number"
                                                />
                                                <InputGroup.Append>
                                                    <Button size="sm" variant="outline-success" onClick={(event)=>handleCountIncDec(index, 1, event)}>+</Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </td>
                                        <td>{inventory.current_quantity}</td>
                                        <td>
                                            <InputGroup>
                                                <FormControl
                                                    value={count[index].newSalePrice}
                                                    onChange={(event)=> handleSetNewSalePrice(index, event)}
                                                    aria-label="product-sale-price"
                                                    type="number"
                                                >
                                                </FormControl>
                                            </InputGroup>
                                        </td>
                                        <td>${inventory.cost}</td>
                                        <td>{inventory.receive_date}</td>
                                        <td>{inventory.supplier_name}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Container fluid>
                    <Row>
                        <Col>Total Count: {totalCount}</Col>
                        <Col>Total Sales: ${totalSale}</Col>
                        <Col>
                            <Button size="sm" variant="success" onClick={(event)=>addProductToCart(event)}>ADD TO CART</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default AddProductModal;