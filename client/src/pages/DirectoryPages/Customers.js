import React, {Component} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import {Modal, Button, Container, Row, Col, InputGroup, FormControl} from "react-bootstrap";
import Api from "../../Utils/Api";
import FindRestaurantResults from '../../Components/FindRestaurantResults/FindRestaurantResults';

class Customers extends Component{
    static contextType = DirectoryContext;
    state = {
        display: undefined,
        subMenuDisplay: undefined,
        findRestaurantResults: undefined,
        location: "44114",
        btnDownloadCsv: true,
        searching: false,
        exportName: "44114"
    }

    handleExportName = (event) => {
        event.preventDefault()
        this.setState({exportName: event.target.value})
    }

    handleLocationChange = (event) =>{
        event.preventDefault()
        this.setState({location: event.target.value})
    }
    //Search yelp for restaurants at a specified location and radius
    searchYelp = () =>{
        this.setState({searching: true})
        Api.searchYelp({
            //Trim search paramters before sending to server
                term: "restaurants",
                categories: "chinese, japanese, sushi",
                radius: "40000",
                location: this.state.location,
                limit: "50",
        }).then(data => {
            console.log(data.data);
            this.setState({findRestaurantResults: data.data})
            this.setState({display: "SearchYelp"})
            this.setState({searching: false})
            if(data.data.length > 0){
                this.setState({btnDownloadCsv: false})
            }
        })
    }

    exportCSV = () => {
        Api.exportRestaurantCSV({
            restaurants: this.state.findRestaurantResults
        }).then( results => {
            console.log(results)
            //Figure a way to download the csv file sent from the server
        }).catch( err => {
            console.log(err)
        })
    }

    subMenuDisplaySwitch = () => {
        switch (this.state.subMenuDisplay){
            case "FindNewCsutomers":
                return(
                    <>
                        <Col>
                            <InputGroup 
                                className="mb-3"
                                onChange={(event) => {this.handleLocationChange(event)}}
                            >
                                <InputGroup.Prepend>
                                <Button 
                                    variant="success" 
                                    disabled={this.state.searching}
                                    onClick={()=>this.searchYelp()}
                                >
                                    {this.state.searching? "Loading...": "Search"}
                                </Button>
                                </InputGroup.Prepend>
                                <FormControl
                                    value={this.state.location}
                                    aria-describedby="basic-addon1" 
                                />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Button variant="success" disabled={this.state.btnDownloadCsv}>Compare to Existing</Button>
                        </Col>
                        <Col>
                            <InputGroup 
                                className="mb-3"
                                onChange={(event) => {this.handleExportName(event)}}
                            >
                                <InputGroup.Prepend>
                                <Button 
                                    variant="success" 
                                    disabled={this.state.btnDownloadCsv} 
                                    onClick={()=> this.exportCSV()}
                                >
                                    Export CSV
                                </Button>
                                </InputGroup.Prepend>
                                <FormControl
                                    aria-describedby="export-name" 
                                />
                            </InputGroup>
                        </Col>
                    </>
                );
            default:
                return(
                    null
                )
            }
    }

    customerDisplaySwitch = () =>{
        switch (this.state.display){
            case "SearchYelp":
                return(
                    <FindRestaurantResults 
                        results={this.state.findRestaurantResults}
                    />
                );
            default:
                return(
                   null
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
                        <Button>Button</Button> <Button onClick={() => this.setState({subMenuDisplay: "FindNewCsutomers"})}>Find Customers</Button>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    {this.subMenuDisplaySwitch()}
                </Row>
                <Row>
                    {this.customerDisplaySwitch()}
                </Row>
            </Container>
        )
    }
}

export default Customers;