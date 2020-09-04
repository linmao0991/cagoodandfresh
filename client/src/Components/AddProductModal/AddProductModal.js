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
//--------------Finished initializing count state as a array of objects in the format listed on the line above.
//--------------Finished handleSetCount to set the coutn state based on the input field values.
//----------//Next Task
//--------------addProductToCart needs to loop though count state and add each array inventory to the cart.
//-----This will also allow user to add quantities from different loads AND we can possibly allow user to change the sale price if we set count state as objects with quantity and sale_price

function AddProductModal (props) {
    const orderContext = useContext(OrderContext);
    const setInitialCount = () =>{
        let initialState = []
        for (let [index, inventory] of props.productInven.entries()){
            initialState.push({index: index, quantity: 0})
        }
        return initialState;
    }
    const [show, toggleShow] = useState(props.show);
    const [count, setCount] =useState(setInitialCount());
    console.log("[Intial Count State]")
    console.log(count);
    //Function to add selected product into the cart then stores updated cart to OrderContext
    const addProductToCart = (inventory) => {
        //Create new object with combined product data and inventory data
        let newCartItem = {
            ...props.productData,
            quantity: count,
            sales_price: inventory.sale_price,
            cost: inventory.cost,
            inventory_id: inventory.id,
            ar_invoice_number: inventory.ar_invoice_number,
            supplier_name: inventory.supplier_name,
            supplier_id: inventory.supplier_id
        }
        //Add new cart item to the existing cart
        let cart = orderContext.cartData.concat({...props.productData, ...newCartItem})
        console.log("[Old Cart]")
        console.log(orderContext.cartData);
        console.log("[New Cart]");
        console.log(cart);
        // Store the updated cart to OrderContext
        orderContext.storeCart(cart)
        props.toggleShow(!show)
    }

    const handleSetCount = (index, value, event) => {
        event.preventDefault()
        console.log("[----handleSetCount-----]")
        console.log("Key "+index)
        console.log("Value "+value)
        let newState = [...count];
        console.log("Old State");
        console.log(newState)
        newState.splice(index, 1, {index: index, quantity: value})
        console.log("New State");
        console.log(newState)
        setCount(newState)
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
                                                onChange={(event)=>handleSetCount(index, event.target.value, event)}
                                                key={index}
                                            >
                                            <FormControl
                                                placeholder=""
                                                aria-label="product count"
                                            />
                                                <InputGroup.Append>
                                                    <Button size="sm" variant="outline-success" onClick={(event)=>addProductToCart(inventory)}>Add</Button>
                                                </InputGroup.Append>
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
                <div>Footer</div>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default AddProductModal;