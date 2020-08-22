import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"

function Customers (){
    const directoryContext = useContext(DirectoryContext);
    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    return(
        <div>
            <button onClick={() => directoryContext.switchDir(directoryContext.previousDir)}>Back</button>
            <h1>Customers</h1>
        </div>
    )
}

export default Customers;