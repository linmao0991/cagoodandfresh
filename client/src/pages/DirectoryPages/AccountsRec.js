import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"

function AccountsRec (){
    const directoryContext = useContext(DirectoryContext);
    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    return(
        <div>
            <button onClick={() => directoryContext.switchDir(directoryContext.previousDir)}>Back</button>
            <h1>Accounts Recievable</h1>
        </div>
    )
}

export default AccountsRec;