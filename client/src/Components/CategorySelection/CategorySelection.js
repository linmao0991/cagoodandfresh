import React, {useState, useContext, Component} from "react";
import OrderContext from "../../Context/OrderContext";
import Api from "../../Utils/Api";
import {Container, Row, Col, Button, Modal} from "react-bootstrap"

function CategorySelection (props){
    const orderContext = useContext(OrderContext);

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
        <Button
            onClick = {() => 
                getProductData()
                //orderContext.storeCategorySelection(props.category, "selection-product")
            }
        >
            {props.category}
        </Button>
    )
}

export default CategorySelection;