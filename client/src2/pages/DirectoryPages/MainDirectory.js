import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import LoginContext from "../../Context/LoginContext"
import {Modal, Button, Container, Row, Col} from "react-bootstrap";

function MainDirectory(){
    const directoryContext = useContext(DirectoryContext);
    const loginContext = useContext(LoginContext);

    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    return(
        <Container>
            {console.log("[Main Directory Login Context] ")}
            {console.log(loginContext)}
            {console.log("[Main Directory Directory Context] ")}
            {console.log(directoryContext)}
            <Row>
                <Col></Col>
                <Col>
                    <h1>Directory</h1>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    {loginContext.permissionLevel >= 1?
                        <div>
                            <Button onClick={() => directoryContext.switchDir("orderform")}>Order Form</Button>
                            <br />
                            <Button onClick={() => directoryContext.switchDir("inventory")}>Inventory</Button>
                            <br />
                            <Button onClick={() => directoryContext.switchDir("customers")}>Customers</Button>
                            <br />
                        </div>
                    : 
                    null}
                    {loginContext.permissionLevel >= 2?
                        <div>
                            <Button onClick={() => directoryContext.switchDir("accountsrec")}>Accounts Recieveable</Button>
                            <br />
                            <Button onClick={() => directoryContext.switchDir("accountspay")}>Accounts Payable</Button>
                            <br />
                        </div>
                    :
                    null}
                    {loginContext.permissionLevel >= 3?
                        <div>
                            <Button onClick={() => directoryContext.switchDir("admintools")}>Administrator Tools</Button>
                        </div>
                    :
                    null}
                </Col> 
            </Row>
        </Container>
    );
}

export default MainDirectory;