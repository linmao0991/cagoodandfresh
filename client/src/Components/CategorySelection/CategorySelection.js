import React, {useContext} from "react";
import OrderContext from "../../Context/OrderContext";
import Api from "../../Utils/Api";
import './CategorySelection.css';

function CategorySelection (props){
    const orderContext = useContext(OrderContext);

    //Gets all products from selected category and sends it to be stored to context
    const getProductData = () =>{
        Api.getProductsByCate({
            category: props.category
        }).then( products => {
            console.log(products.data)
            orderContext.storeCategorySelection(props.category, products.data,"selection-product")
        }).catch(err => {
            console.log("something went wrong")
        })
    }

    return(
        <div className="w3-hover-shadow w3-card w3-quarter"
            onClick = {() => 
                getProductData()
            }
        >
            <img src="\assets\images\produce.jpg" className="w3-round w3-image w3-hover-sepia" alt="Produce"/>
            <div className="w3-container w3-center">
                <p>{props.category.toUpperCase()}</p>
            </div>
        </div>
    )
}

export default CategorySelection;