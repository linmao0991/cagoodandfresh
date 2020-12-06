import React, {useContext, useState} from "react";
import {Modal, Container, Row, Col, Button, Table, InputGroup, FormControl} from "react-bootstrap";
import OrderContext from "../../context/OrderContext";

function AddProductToCart (props) {
    const orderContext = useContext(OrderContext);

    //Function to set the intial count of the inventory with default values and inventory data from conetext
    const setInitialCount = () =>{
        let initialCountState = []
        let dbInventory = [...props.productInven]
        for (let [index, inventory] of dbInventory.entries()){
            initialCountState.push({index: index, quantity: 0, newSalePrice: inventory.sale_price, inventory: inventory})
        }
        return initialCountState;
    }

    //const [show, toggleShow] = useState(props.show);
    const [count, setCount] = useState(setInitialCount());
    const [totalCount, setTotalCount] = useState(undefined)
    const [totalSale, setTotalSale] = useState(undefined)

    //Function to add selected product into the cart then stores updated cart to OrderContext
    const addProductToCart = (event) => {
        event.preventDefault()
        console.log(count)
        //Create new object with combined product data and inventory data
        let newCartItems = 
            count.map(item => {
                //Spread both inventory, product, and quantity data into new cartItem
                let cartItem ={
                    ...props.productData,
                    product_code: item.inventory.product_code,
                    receive_date: item.inventory.receive_date,
                    quantity: item.quantity,
                    sale_price: item.newSalePrice,
                    cost: item.inventory.cost,
                    inventory_id: item.inventory.id,
                    ar_invoice_number: item.inventory.ar_invoice_number,
                    supplier_name: item.inventory.supplier_name,
                    supplier_id: item.inventory.supplier_id
                }
                //If the quantity is > 0 return this new cartItem
                if(item.quantity>0){
                    return cartItem
                }else{
                    return null
                }
            //Filter through the new array returned by map and remove indexes that contain null.
            }).filter(cartItem =>{
                return(cartItem? cartItem: null)
            })

        //Get cartData store to cartData
        let cartData = [...orderContext.cartData]
        //If cartData is empty, then spread newCartItmes inside and set context
        if (cartData.length === 0){
            cartData=[...newCartItems]
        }else{
            //If not empty then loop through each newCartItems and cartData indexes and find matching inventory id.
            for(let newCartItem of newCartItems){
                //find index in old cart where inventory_id and sale_price are the same
                let oldCartIndex = cartData.findIndex( oldCartItem => 
                    oldCartItem.inventory_id === newCartItem.inventory_id
                    &&
                    Number(oldCartItem.sale_price) === Number(newCartItem.sale_price)
                )
                if ( oldCartIndex > -1){
                    //If index is found then add new cart item to the old cart item witht eh same sale_price and inventory_id
                    cartData[oldCartIndex].quantity += newCartItem.quantity
                    //cartData.push(newCartItem)
                }else{
                    //Otherwise add newCartItem to the old cart
                    cartData.push(newCartItem)
                }
            }
        }
        //Update order cart total sales
        let totalCartSales = cartData.reduce((accumulator, currentValue) => {
            return (accumulator+(currentValue.sale_price*currentValue.quantity))
        },0)
        // Store new cart total sales
        orderContext.storeCartTotalSales(totalCartSales)
        // Store the updated cart to OrderContext
        orderContext.storeCart(cartData)
        // Calls the toggleShow function in the parent component ProductListing to hide the modal
        props.toggleShow(!props.show)
    }

    //Sets the item count by manual input and calculates...
    //...new total count and sales then sets the state
    const handleSetCount = (index, event) => {
        event.preventDefault()
        let newState = [...count]
        newState[index].quantity = Number(event.target.value)
        console.log(newState[index].quantity)
        console.log(typeof newState[index].quantity)
        calculateTotals(newState)
        setCount(newState)
    }

    //Sets the sale price of current item and calculates...
    //...new total count and sales then sets the states
    const handleSetNewSalePrice = (index, event) => {
        event.preventDefault()
        let newState = [...count]
        newState[index].newSalePrice = Number(event.target.value)
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
        let newTotalSales = newState.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.quantity * Number(currentValue.newSalePrice))
        },0)
        setTotalCount(newTotalCount)
        setTotalSale(newTotalSales.toFixed(2))
    }

    return(
        <>
        <Modal
            size="lg"
            show={props.show}
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
                                                    value={Number(count[index].newSalePrice).toFixed(2)}
                                                    onChange={(event)=> handleSetNewSalePrice(index, event)}
                                                    aria-label="product-sale-price"
                                                    type="number"
                                                >
                                                </FormControl>
                                            </InputGroup>
                                        </td>
                                        <td>${Number(inventory.cost).toFixed(2)}</td>
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
                            <Button size="sm" variant="success" style={{float: 'left'}} onClick={(event)=>addProductToCart(event)}>Add To Cart</Button>{''}
                            <Button size="sm" variant="danger" style={{float: 'right'}} onClick={()=>props.toggleShow(!props.show)}>Cancel</Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Footer>
        </Modal>
        </>
    )

}

export default AddProductToCart;