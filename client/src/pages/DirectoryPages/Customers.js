import React, {useState, useContext, Component} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import {Modal, Button, Container, Row, Col} from "react-bootstrap";
import Api from "../../Utils/Api";
import FindRestaurantResults from '../../Components/FindRestaurantResults/FindRestaurantResults';

class Customers extends Component{
    static contextType = DirectoryContext;
    state = {
        display: undefined,
        findRestaurantResults: undefined,
    }

    //Search yelp for restaurants at a specified location and radius
    searchYelp = () =>{
        Api.searchYelp({
            //Trim search paramters before sending to server
                term: "restaurants",
                categories: "chinese, japanese, sushi",
                radius: "40000",
                location: "44114",
                limit: "50",
        }).then(data => {
            console.log(data.data);
            this.setState({findRestaurantResults: data.data})
            this.setState({display: "FindRestaurants"})
        })
    }

    customerDisplaySwitch = () =>{
        switch (this.state.display){
            case "FindRestaurants":
                return(
                    <FindRestaurantResults 
                        results={this.state.findRestaurantResults}
                    />
                );
            default:
                return(
                    <Col>Select a Function</Col>
                );
        }
    }

    render(){
        return(
            <Container>
                <Row>
                    
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <h1>Customers</h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* <Button onClick={() => this.context.switchDir(this.context.previousDir)}>Back</Button> */}
                    </Col>
                    <Col>
                        <Button>Button</Button> <Button onClick={() => this.searchYelp()}>Find Customers</Button>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    {this.customerDisplaySwitch()}
                </Row>
            </Container>
        )
    }
}

export default Customers;