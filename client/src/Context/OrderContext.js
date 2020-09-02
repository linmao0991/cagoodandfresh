import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    cartData: undefined,
    productCate: undefined,
    categorySelection: undefined,
    searchType: undefined,
    productData: undefined,
    storeCustomer: () => {},
    storeCategory: () => {},
    storeCart: () => {},
    storeCategorySelection: () => {},
    storeSearchType: () => {},
})

export default orderContext