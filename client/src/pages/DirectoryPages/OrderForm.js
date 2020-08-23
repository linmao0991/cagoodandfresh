import React, {useState, useContext} from "react";
import DirectoryContext from "../../Context/DirectoryContext"
import Api from "../../Utils/Api"

function OrderForm (){
    const directoryContext = useContext(DirectoryContext);
    const [phone, phoneInput] = useState(null);
    const [name, nameInput] = useState(null);
    const [account, accountInput] = useState(null);

    const getCustomerInfo = (event) => {
        event.preventDefault();
        Api.getCustomerInfo({
            customer_account_number:account,
            business_phone_number: phone,
            restaurant_name_english: name
        }).then ( info => {
            console.log(info)
        }).catch( err => {
            console.log(err)
        })
    }

    return(
        <div>
            <button onClick={() => directoryContext.switchDir(directoryContext.previousDir)}>Back</button>
            <h1>Order Form</h1>
            <form>
                <input
                    value = {account}
                    type = "text"
                    label = "account number"
                    autoComplete= "text"
                    onChange = {event => accountInput(event.target.value)}
                    className="form-control validate"
                />
                <br />
                <input
                    value = {phone}
                    type = "text"
                    label = "phone number"
                    autoComplete= "text"
                    onChange = {event => phoneInput(event.target.value)}
                    className="form-control validate"
                />
                <br />
                <input
                    value = {name}
                    type = "text"
                    label = "name"
                    autoComplete= "text"
                    onChange = {event => nameInput(event.target.value)}
                    className="form-control validate"
                />
                <br />
            </form>
            <button onClick={event => getCustomerInfo(event)}>Get Info</button>
        </div>
    )
}

export default OrderForm;