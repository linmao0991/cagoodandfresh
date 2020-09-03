import React, {useContext, useState} from "react";
import {Container, Row, Col, Modal, Button} from "react-bootstrap";
import Api from "../../Utils/Api";
import OrderContext from "../../Context/OrderContext";
import InventoryModal from "../InventoryModal/InventoryModal";

//Add Modal to display product information
//--Call to inventory table
//--Toggled by select button
//--display inventory counts
//----different records of inventory in at different prices
//--display detailed information

//Add function to select item to cart

function ProductListing (props){
    const [show, toggleShow] = useState(false)
    const [productInven, storeInven] = useState(undefined)

    const getInventoryData = () =>{
        Api.getInventoryByOroduct({
            productCode: props.product.id
        }).then( inventory => {
            console.log(inventory.data)
            storeInven(inventory.data);
            toggleShow(!show)
        }).catch( err => {
            console.log("Something went wrong in get inventory by product");
            console.log(err)
        })

    }

    const handleModalToggle = () => toggleShow(!show);

    return(
        <>
        <tr>
            <td><Button size="sm" variant="outline-success" onClick={() => getInventoryData()}>Select</Button></td>
            <td>{props.product.name_english}</td>
            <td>{props.product.name_chinese}</td>
            <td>{props.product.holding}</td>
            <td>{props.product.weight} {props.product.measurement_system}</td>
        </tr>
        {show? 
            <InventoryModal
                show = {show}
                productInven = {productInven}
                productData = {props.product}
                toggleShow = {handleModalToggle}
            />
        : null}
        </>
    )
}

export default ProductListing;