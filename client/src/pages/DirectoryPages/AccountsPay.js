import React, {Component} from "react";
import DirectoryContext from "../../context/DirectoryContext"
import {Button, Container, Row, Col} from "react-bootstrap";

class AccountsPay extends Component{
    static contextType = DirectoryContext;
    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    render(){
        return(
            <Container>
                <Row>
                    
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col>
                        <h1>Accounts Payable</h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* <Button onClick={() => this.context.switchDir(this.context.previousDir)}>Back</Button> */}
                    </Col>
                    <Col>
                        <Button>Button</Button>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        )
    }
}

export default AccountsPay;