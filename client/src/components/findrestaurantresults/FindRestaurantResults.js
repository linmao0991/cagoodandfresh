import React from 'react';
import {Container,Table} from 'react-bootstrap';

function FindRestaurantResults (props){

    return(
        <Container 
            fluid
        >
            <Table
                striped 
                bordered 
                hover
                variant="dark"
                style={{
                    fontSize: "14px"
                }}
            >
                <thead style={{fontSize: "16px", fontWeight: "bold"}}>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Street Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zipcode</th>
                    <th>Distance</th>
                    </tr>
                </thead>
                <tbody>
                    {props.results.map((restaurant, index)=> {
                        return(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.display_phone}</td>
                                <td>{restaurant.location.address1}, {restaurant.location.address2? restaurant.location.address2+", ": null}{restaurant.location.address3? restaurant.location.address3+", ": null}</td>
                                <td>{restaurant.location.city}</td>
                                <td>{restaurant.location.state}</td>
                                <td>{restaurant.location.zip_code}</td>
                                <td>{(restaurant.distance/1760).toFixed(2)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default FindRestaurantResults