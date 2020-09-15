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

    const listingStyle = {
        tbody: {
            display:'block',
            position: 'relative',
            fontSize: "14px",
            overflowY: "scroll",
            height: "500px",
            borderStyle: 'solid',
            width: '100%'
            },
        thead: {
            fontSize: "14px",
            display:'block',
            position: 'relative',
            width: '100%'
        },
        scroll: {
            display: 'block',
            emptyCells: 'show'
        },
        tr: {
            width: '100%',
            display: 'flex'
        },
        tdth: {
            flexBasis: '100%',
            flexGrow: 2,
            display: 'block',
            textAlign: 'left'
        },
    }

    return( 
        <>   
            <Table
                striped 
                bordered 
                hover
                variant="dark"
            >
                <colgroup>
                    <col style={{width: "10%"}}/>
                    <col style={{width: "5%"}}/>
                    <col style={{width: "35%"}}/>
                    <col style={{width: "30%"}}/>
                    <col style={{width: "10%"}}/>
                    <col style={{width: "10%"}}/>
                </colgroup>
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <td style={{fontSize: "16px", fontWeight: "bold"},listingStyle.tdth}>{props.categorySelection}</td>
                        <td style={listingStyle.tdth}>Inventory</td>
                        <td style={listingStyle.tdth}>Product Name English</td>
                        <td style={listingStyle.tdth}>Product Name Chinese</td>
                        <td style={listingStyle.tdth}>Holding</td>
                        <td style={listingStyle.tdth}>Size</td>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {props.allProductData.map((product, index) => {
                        return(
                            <tr key={index} style={listingStyle.tr}>
                                <td style={listingStyle.tdth}><Button size="sm" variant="outline-success" onClick={() => getInventoryData(product)}>Select</Button></td>
                                <td
                                    style={listingStyle.tdth}
                                >{
                                    product.inventory_count - orderContext.cartData.reduce(
                                        (accumulator, currentValue) => {
                                            if(currentValue.product_code == product.id){
                                                return accumulator + currentValue.quantity
                                            }else{
                                                return accumulator;
                                            }
                                        },0
                                        )
                                    }</td>
                                <td style={listingStyle.tdth}>{product.name_english}</td>
                                <td style={listingStyle.tdth}>{product.name_chinese}</td>
                                <td style={listingStyle.tdth}>{product.holding}</td>
                                <td style={listingStyle.tdth}>{product.weight} {product.measurement_system}</td>
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