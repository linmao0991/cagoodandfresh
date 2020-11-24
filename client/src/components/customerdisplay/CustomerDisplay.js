import React from "react";
import {Button, Table} from "react-bootstrap";

function CustomerDisplay(props){

    const formatPhoneNumber = (phoneNumberString) => {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        }
        return null
      }

    return(
        <div>
            <Table striped bordered variant="dark">
                <thead>
                    <tr>
                    <th>Select</th>
                    <th>Name Chinese</th>
                    <th>Name English</th>
                    <th>Phone</th>
                    <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.map((customer, index) => {
                        return(
                            <tr key={index}>
                            <td><Button variant="info" onClick = {() => props.selectCustomer(customer)}>Select</Button></td>
                            <td>{customer.restaurant_name_chinese}</td>
                            <td>{customer.restaurant_name_english}</td>
                            <td>{formatPhoneNumber(customer.business_phone_number)}</td>
                            <td>{customer.billing_street}, {customer.billing_city}, {customer.billing_state} {customer.billing_zipcode}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default CustomerDisplay;