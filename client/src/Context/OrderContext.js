import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    cartData: undefined,
    productCate: undefined,
    orderContextCustStore: () => {},
    orderContextCateStore: () => {},
    orderContextCartStore: () => {}
})

export default orderContext