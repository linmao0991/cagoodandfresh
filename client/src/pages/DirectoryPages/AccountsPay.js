import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"


function AccountsPay(){
    const directoryContext = useContext(DirectoryContext);
    const [email, emailNameInput] = useState("");
    const [password, passwordInput] = useState("");

    return(
        <div>
            <button>Back</button>
            <h1>Accounts Payable</h1>
        </div>
    )
};

export default AccountsPay;