import React, {Component} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import {Modal, Button, Container, Row, Col, InputGroup, FormControl} from "react-bootstrap";
import Api from "../../Utils/Api";
import FindRestaurantResults from '../../Components/FindRestaurantResults/FindRestaurantResults';
import download from "downloadjs";

class Customers extends Component{
    static contextType = DirectoryContext;
    state = {
        display: undefined,
        subMenuDisplay: undefined,
        findRestaurantResults: undefined,
        location: "44114",
        btnDownloadCsv: true,
        btnFilterResults: true,
        btnSearch: false,
        searching: false,
        exportName: "44114",
        exportingPending: false,
        filteringPending: false
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
        this.setState({
            searching: true,
            btnSearch: true
        })
        Api.searchYelp({
            //Trim search paramters before sending to server
                term: "restaurants",
                categories: "chinese,japanese",
                radius: "40000",
                location: this.state.location,
                limit: "50",
        }).then(data => {
            console.log(data.data);
            this.setState({
                findRestaurantResults: data.data,
                display: "SearchYelp",
                searching: false,
                btnSearch: false
            })
            if(data.data.length > 0){
                this.setState({
                    btnDownloadCsv: false,
                    btnFilterResults: false
                })
            }
        })
    }

    filterSearchResults = () => {
        this.setState({
            btnSearch: true,
            btnDownloadCsv: true,
            btnFilterResults: true,
            filteringPending: true
        })
        Api.filterSearchResults({
            restaurants: this.state.findRestaurantResults
        }).then( data => {
            this.setState({
                findRestaurantResults: data.data,
                btnSearch: false,
                btnDownloadCsv: false,
                btnFilterResults: false,
                filteringPending: false
            })
            
        })
    }

    exportCSV = () => {
        this.setState({
            btnSearch: true,
            btnDownloadCsv: true,
            btnFilterResults: true,
            exportingPending: true
        })
        Api.exportRestaurantCSV({
            csvName: this.state.exportName,
            restaurants: this.state.findRestaurantResults
        }).then( results => {
            Api.downloadCSV(this.state.exportName).then(file =>{
                this.setState({
                    btnSearch: false,
                    btnDownloadCsv: false,
                    btnFilterResults: false,
                    exportingPending: false
                })
                console.log(file)
                //window.location.href = (file)
                console.log(this.state.exportName+'.csv')
                download(file.data, this.state.exportName+'.csv')
            })
            //Figure a way to download the csv file sent from the server
        }).catch( err => {
            this.setState({
                btnSearch: false,
                btnDownloadCsv: false,
                btnFilterResults: false,
                exportingPending: false
            })
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
                                    variant={this.state.searching? "warning":"success"}  
                                    disabled={this.state.btnSearch}
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
                            <Button 
                                variant={this.state.filteringPending? "warning":"success"} 
                                disabled={this.state.btnFilterResults}
                                onClick={()=> this.filterSearchResults()}
                            >
                                {this.state.filteringPending? "Filtering...": "Filter Results"}
                            </Button>
                        </Col>
                        <Col>
                            <InputGroup 
                                className="mb-3"
                                onChange={(event) => {this.handleExportName(event)}}
                            >
                                <InputGroup.Prepend>
                                <Button 
                                    variant={this.state.exportingPending? "warning":"success"} 
                                    disabled={this.state.btnDownloadCsv} 
                                    onClick={()=> this.exportCSV()}
                                >
                                    {this.state.exportingPending? "Exporting...": "Export CSV"}
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
                        <Button variant="info" onClick={() => this.setState({subMenuDisplay: "FindNewCsutomers"})}>Restaurant Search</Button>
                    </Col>
                    <Col></Col>
                </Row>
                <br />
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