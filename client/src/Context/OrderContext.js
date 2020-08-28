import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    orderCartData: undefined,
    orderContextStore: () => {}
})

export default orderContext