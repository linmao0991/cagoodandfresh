import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"

function MainDirectory(){
    const directoryContext = useContext(DirectoryContext);
    // const [email, emailNameInput] = useState("");
    // const [password, passwordInput] = useState("");

    return(
        <div>
                <h1>Directory</h1>
                <br />
                {/* Permission Level 1*/}
                <h2>Order Form</h2><button onClick={() => directoryContext.switchDir("orderform")}>Back</button>
                <br />
                <h2>Inventory</h2><button onClick={() => directoryContext.switchDir("inventory")}>Back</button>
                <br />
                <h2>Customers</h2><button onClick={() => directoryContext.switchDir("customers")}>Back</button>
                <br />
                {/* Permission Level 2*/}
                <h2>Accounts Recieveable</h2><button onClick={() => directoryContext.switchDir("accountsrec")}>Back</button>
                <br />
                <h2>Accounts Payable</h2><button onClick={() => directoryContext.switchDir("accountspay")}>Back</button>
                <br />
                {/* Permission Level 3*/}
                <h2>Administrator Tools</h2><button onClick={() => directoryContext.switchDir("admintools")}>Back</button>
        </div>
    );
}

export default MainDirectory;