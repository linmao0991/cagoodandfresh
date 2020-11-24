import React, {useState, useContext} from "react";
import {Table, Button} from "react-bootstrap";
import Api from "../../utils/Api";
import AddProductModal from "../addproductmodal/AddProductModal";
import OrderContext from '../../context/OrderContext';

function ProductListing (props){
    const orderContext = useContext(OrderContext)

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
    
    //Sets the initial inventory count for each inventory of product and 
    //updates current quantity if selected product is already in the cart
    const setInitialInventory = (inventory) => {
        let cartData = [...orderContext.cartData]
        let dbInventory = [...inventory]
        //Checks for a empty cart
        // if(cartData.length > 0){
            //If there is existing cart items, then loop through each and find any that matched the selected product
            //and update current quantity based on the quantity of selected items already in cart
            let initialInventory = dbInventory.map((inventory, index) => {
                let updatedInventory = {...inventory}
                let cartItem = cartData.find(cartItem => cartItem.inventory_id === updatedInventory.id)
                updatedInventory.cost = Number(inventory.cost)
                updatedInventory.invoice_quantity = Number(inventory.invoice_quantity)
                updatedInventory.sale_price = Number(inventory.sale_price)
                updatedInventory.current_quantity = Number(inventory.current_quantity)
                if(cartItem){
                    updatedInventory.current_quantity = Number(inventory.current_quantity)-Number(cartItem.quantity)
                    return updatedInventory
                }else{
                    return updatedInventory
                }
            })
            console.log(initialInventory)
            return initialInventory
        // }else{
        //     //Returns inventory from database unedited
        //     return [...dbInventory]
        // }
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
            //width: '100%'
            },
        thead: {
            fontSize: "14px",
            display:'block',
            overflowY: 'scroll',
            position: 'relative',
            //width: '100%'
        },
        scroll: {
            display: 'block',
            emptyCells: 'show'
        },
        tr: {
            //width: '100%',
            display: 'flex'
        },
        tdth: {
            //flexBasis: '100%',
            //flexGrow: 2,
            display: 'block',
            textAlign: 'left'
        },
        col_1_width :{
            width: '10%'
        },
        col_2_width :{
            width: '8%'
        },
        col_3_width :{
            width: '30%'
        },
        col_4_width :{
            width: '30%'
        },
        col_5_width :{
            width: '12%'
        },
        col_6_width :{
            width: '10%'
        }
    }

    return( 
        <>   
            <Table
                striped 
                bordered 
                hover
                variant="dark"
            >
                <thead style={listingStyle.thead}>
                    <tr style={listingStyle.tr}>
                        <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}>{props.categorySelection}</td>
                        <td style={{...listingStyle.col_2_width,...listingStyle.tdth}}>Stock</td>
                        <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>Product Name English</td>
                        <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>Product Name Chinese</td>
                        <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>Holding</td>
                        <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>Size</td>
                    </tr>
                </thead>
                <tbody style={listingStyle.tbody}>
                    {props.allProductData.map((product, index) => {
                        return(
                            <tr key={index} style={listingStyle.tr}>
                                <td style={{...listingStyle.col_1_width,...listingStyle.tdth}}><Button size="sm" variant="outline-success" onClick={() => getInventoryData(product)}>Select</Button></td>
                                <td
                                    style={{...listingStyle.col_2_width,...listingStyle.tdth}}
                                >{
                                    product.inventory_count - orderContext.cartData.reduce(
                                        (accumulator, currentValue) => {
                                            if(currentValue.product_code === product.id){
                                                return accumulator + currentValue.quantity
                                            }else{
                                                return accumulator;
                                            }
                                        },0
                                        )
                                    }</td>
                                <td style={{...listingStyle.col_3_width,...listingStyle.tdth}}>{product.name_english}</td>
                                <td style={{...listingStyle.col_4_width,...listingStyle.tdth}}>{product.name_chinese}</td>
                                <td style={{...listingStyle.col_5_width,...listingStyle.tdth}}>{product.holding}</td>
                                <td style={{...listingStyle.col_6_width,...listingStyle.tdth}}>{product.weight} {product.measurement_system}</td>
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