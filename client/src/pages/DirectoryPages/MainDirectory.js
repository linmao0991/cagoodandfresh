import React, {useState, useContext} from "react";

function mainDirectory(){

    return (
        <div>
                <h1>Directory</h1>
                {/* Permission Level 1*/}
                <h2>Order Form</h2>
                <h2>Inventory</h2>
                <h2>Customers</h2>
                {/* Permission Level 2*/}
                <h2>Accounts Recieveable</h2>
                <h2>Accounts Payable</h2>
                {/* Permission Level 3*/}
                <h2>Administrator Tools</h2>
        </div>
    );
}

export default mainDirectory;