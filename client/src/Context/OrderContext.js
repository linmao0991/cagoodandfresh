import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    cartData: [],
    cartTotalSales: 0,
    productCate: undefined,
    categorySelection: undefined,
    searchType: undefined,
    productData: undefined,
    storeCustomer: () => {},
    storeCategory: () => {},
    storeCart: () => {},
    storeCategorySelection: () => {},
    storeSearchType: () => {},
    storeCartTotalSales: () => {},
})

export default orderContext