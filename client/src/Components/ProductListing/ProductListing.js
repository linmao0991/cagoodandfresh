import React, {useState} from "react";
import {Table, Button} from "react-bootstrap";
import Api from "../../Utils/Api";
import AddProductModal from "../AddProductModal/AddProductModal";

//--display detailed information
function ProductListing (props){
    const [show, toggleShow] = useState(false)
    const [productInven, storeInven] = useState(undefined)
    const [productData, storeProduct] = useState(undefined)

    const getInventoryData = (product) =>{
        storeProduct(product)
        Api.getInventoryByOroduct({
            productCode: product.id
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
        <Table
            striped 
            bordered 
            hover
            variant="dark"
            style={{
                fontSize: "14px"
            }}
        >
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