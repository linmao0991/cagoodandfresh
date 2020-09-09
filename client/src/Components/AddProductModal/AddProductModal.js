import React, {useContext, useState} from "react";
import {Modal, Container, Row, Col, Button, Table, InputGroup, FormControl} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

//==Issue==
//----Inputting quantities in multiple input fields then clicking on a NON corresponding add button will update state baseed on the LAST input field.
//---Fix Requirements
//-----Find a way to associate button with corresponding inputs and then update state while accounting for quantities in multiple input fields
//--Possible Fixes
//-----Use an array for the count state, intialize the state array with the number of inventory in index order
//-----Use the index position for each inventory as keys for the MAP elements to asscoiate inputs with state index.
//-----EX: count = [inventory1, inventory2, inventory3] aka [index 1, index 2, index 3]. Then each elements will have keys 1,2,3 we can use to assocaite input values.
//---Finished initializing count state as a array of objects in the format listed on the line above.
//---Finished handleSetCount to set the coutn state based on the input field values.
//----//Next Task
//------addProductToCart needs to loop though count state and add each array inventory to the cart.
//--This will also allow user to add quantities from different loads AND we can possibly allow user to change the sale price if we set count state as objects with quantity and sale_price

function AddProductModal (props) {
    const orderContext = useContext(OrderContext);
    const setInitialCount = () =>{
        let initialState = []
        for (let [index, inventory] of props.productInven.entries()){
            initialState.push({index: index, quantity: 0, inventory: inventory})
        }
        return initialState;
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
                    sales_price: item.inventory.sale_price,
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
        props.toggleShow(!show)
    }

    const handleSetCount = (index, value, event) => {
        event.preventDefault()
        let newState = [...count]
        newState[index].quantity = value
        setCount(newState)
    }

    const handleCountIncDec = (index, value, event)=>{
        event.preventDefault()
        let newState =[...count]
        let currentItemCount = newState[index].quantity
        let inventoryCount = newState[index].inventory.current_quantity
        let changeValue = value
        if( (currentItemCount+changeValue >= 0) && (currentItemCount+changeValue <= inventoryCount)){
            newState[index].quantity = newState[index].quantity + value
            console.log(newState)
            let newTotalCount = newState.reduce((accumulator, currentValue) => {return accumulator + currentValue.quantity},0)
            let newTotalSales = newState.reduce((accumulator, currentValue) => {return accumulator + (currentValue.quantity * currentValue.inventory.sale_price)},0)
            console.log(newTotalCount)
            console.log(newTotalSales)
            setTotalCount(newTotalCount)
            setTotalSale(newTotalSales.toFixed(2))
            setCount(newState)
        }
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
                                                value={count[index].quantity}
                                                onChange={(event)=>handleSetCount(index, event.target.value, event)}
                                                placeholder=""
                                                aria-label="product-count"
                                            />
                                            <InputGroup.Append>
                                                <Button size="sm" variant="outline-success" onClick={(event)=>handleCountIncDec(index, 1, event)}>+</Button>
                                            </InputGroup.Append>
                                            {/* <InputGroup.Append>
                                                <Button size="sm" variant="outline-success" onClick={(event)=>addProductToCart(event)}>+</Button>
                                            </InputGroup.Append> */}
                                            </InputGroup>
                                        </td>
                                        <td>{inventory.current_quantity}</td>
                                        <td>${inventory.sale_price}</td>
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