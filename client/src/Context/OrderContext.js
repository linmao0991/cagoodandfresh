import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    orderCartData: undefined,
    productCate: undefined,
    orderContextStore: () => {}
})

export default orderContext