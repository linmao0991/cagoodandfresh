import React, {useState, useContext} from "react";
import {Table, Button} from "react-bootstrap";
import Api from "../../Utils/Api";
import AddProductModal from "../AddProductModal/AddProductModal";
import OrderConext from '../../Context/OrderContext';

function ProductListing (props){
    const orderContext = useContext(OrderConext)

    const [show, toggleShow] = useState(false)
    const [productInven, storeInven] = useState(undefined)
    const [productData, storeProduct] = useState(undefined)

    const getInventoryData = (product) =>{
        storeProduct(product)
        Api.getInventoryByProductID({
            productCode: product.id
        }).then( inventory => {
            storeInven(setInitialInventory(inventory.data));
            toggleShow(!show)
        }).catch( err => {
            console.log("Something went wrong in get inventory by product");
            console.log(err)
        })

    }

    const setInitialInventory = (inventory) => {
        console.log(inventory)
        let cartData = [...orderContext.cartData]
        let dbInventory = [...inventory]
        if(cartData.length > 0){
            let initialInventory = dbInventory.map((inventory, index) => {
                let updateInventory = {...inventory}
                let cartItem = cartData.find(cartItem => cartItem.inventory_id === updateInventory.id)
                if(cartItem){
                    updateInventory.current_quantity = (updateInventory.current_quantity-cartItem.quantity).toFixed(2)
                    return updateInventory
                }else{
                    return updateInventory
                }
            })
            return initialInventory
        }else{
            return [...dbInventory]
        }
    }

    const handleModalToggle = () => toggleShow(!show);

    return( 
        <>               
        <Table
            striped 
            bordered 
            hover
            variant="dark"
            style={{
                fontSize: "14px"
            }}
        >
            <colgroup>
                <col style={{width: "10%"}}/>
                <col style={{width: "35%"}}/>
                <col style={{width: "35%"}}/>
                <col style={{width: "10%"}}/>
                <col style={{width: "10%"}}/>
            </colgroup>
            <thead>
                <tr>
                    <td style={{fontSize: "16px", fontWeight: "bold"}}>{props.categorySelection}</td>
                    <td>Product Name English</td>
                    <td>Product Name Chinese</td>
                    <td>Holding</td>
                    <td>Size</td>
                </tr>
            </thead>
            <tbody>
                {props.allProductData.map((product, index) => {
                    return(
                        <tr key={index}>
                            <td><Button size="sm" variant="outline-success" onClick={() => getInventoryData(product)}>Select</Button></td>
                            <td>{product.name_english}</td>
                            <td>{product.name_chinese}</td>
                            <td>{product.holding}</td>
                            <td>{product.weight} {product.measurement_system}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        {show? 
            <AddProductModal
                show = {show}
                productInven = {productInven}
                productData = {productData}
                toggleShow = {handleModalToggle}
            />
        : null}
        </>
    )
}

export default ProductListing;