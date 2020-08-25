import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import {Modal, Button, Container, Row, Col} from "react-bootstrap";

function MainDirectory(){
    const directoryContext = useContext(DirectoryContext);
    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    return(
        <Container>
            <Row>
                <Col></Col>
                <Col>
                    <h1>Directory</h1>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    {/* Permission Level 1*/}
                    <Button onClick={() => directoryContext.switchDir("orderform")}>Order Form</Button>
                    <br />
                    <Button onClick={() => directoryContext.switchDir("inventory")}>Inventory</Button>
                    <br />
                    <Button onClick={() => directoryContext.switchDir("customers")}>Customers</Button>
                    <br />
                    {/* Permission Level 2*/}
                    <Button onClick={() => directoryContext.switchDir("accountsrec")}>Accounts Recieveable</Button>
                    <br />
                    <Button onClick={() => directoryContext.switchDir("accountspay")}>Accounts Payable</Button>
                    <br />
                    {/* Permission Level 3*/}
                    <Button onClick={() => directoryContext.switchDir("admintools")}>Administrator Tools</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default MainDirectory;