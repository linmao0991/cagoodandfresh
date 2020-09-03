import React, {useContext, useState} from "react";
import {Modal, Container, Row, Col, Button, Table, InputGroup, FormControl} from "react-bootstrap";
import OrderContext from "../../Context/OrderContext";

function InventoryModal (props) {
    const orderContext = useContext(OrderContext);
    const [show, toggleShow] = useState(props.show);
    const [count, setCount] =useState("");

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
        //Store the updated cart to OrderContext
        orderContext.storeCart(cart)
    }

    return(
        <>
        {console.log(props.show)}
        <Modal
            size="lg"
            show={show}
            onHide={props.toggleShow}
            backdrop="static"
            keyboard={false}
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
                                                onChange={(event)=>setCount(event.target.value)}
                                            >
                                            <FormControl
                                                placeholder=""
                                                aria-label="product count"
                                            />
                                                <InputGroup.Append>
                                                    <Button size="sm" variant="outline-success" onClick={()=>addProductToCart(inventory)}>Add</Button>
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

export default InventoryModal;