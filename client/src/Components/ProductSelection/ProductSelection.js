import React, {useState, useContext, Component} from "react";
import OrderContext from "../../Context/OrderContext";
import Api from "../../Utils/Api";

//Things to do.
//--Figure out how to call server for categories before rendering selection on the UI
//-----Got function to call server, if you setState to store server data, it will infinitly. Need to figure out a solution
//--Figure out how to layout the category tree holding -> category -> Products
//-----Render button based on categories returned from server data. Then call server to get products in category and render button or card.g
//--Add a functions to select product and store it to the context, then have order cart render the ordercart context. 

class ProductSelection extends Component{
    state = {
        productCate: undefined,
    }
    static contextType = OrderContext;

    getProductCate = () => {
        if(this.context.productCate){
            //this.setState({productCate: this.context.productCate})
            console.log(this.context.productCate)
            return(
                <div>Product Selection</div>
            )
        }else{
        Api.getProductCate().then(data => {
            //this.setState({productCate: data});
            let categories = []
            for (const index in data.data){
                categories.push(data.data[index].category)
            }
            console.log(categories)
            this.setState({productCate: categories})
            return(
                <div>Product Selection</div>
            )
        }).catch(err => {
            console.log("Something went wrong in getProductCate api call")
        })
        }
    }
    render() {
        return(
            <>
            {this.getProductCate()}
            </>
        )
    }
}

export default ProductSelection;