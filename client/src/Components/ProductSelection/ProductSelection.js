import React, {useState, useContext} from "react";
import OrderContext from "../../Context/OrderContext";
import Api from "../../Utils/Api";

//Things to do.
//--Figure out how to call server for categories before rendering selection on the UI
//--Figure out how to layout the category tree holding -> category -> Products
//--Add a functions to select product and store it to the context, then have order cart render the ordercart context. 

function ProductSelection(){
    const orderContext = useContext(OrderContext);
    const [productCate, setProductCate] = useState(undefined)

    const getProductCate = () => {
        if(orderContext.productCate){
            setProductCate(orderContext.productCate)
            console.log(orderContext.productCate)
            return(
                <div></div>
            )
        }else{
        Api.getProductCate().then(data => {
            setProductCate(data);
            console.log(data)
            return(
                <div></div>
            )
        }).catch(err => {
            console.log("Something went wrong in getProductCate api call")
        })
        }
    }
    return (
        <div>
            {/* Below keeps running inifinetly, needs to be fixed. */}
            {getProductCate()}
        </div>
    )
}

export default ProductSelection;