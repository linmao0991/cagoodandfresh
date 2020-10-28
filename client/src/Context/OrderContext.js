import React from "react";

const orderContext = React.createContext({
    selectedCustomerData: undefined,
    cartData: [],
    cartTotalSales: 0,
    productCate: undefined,
    categorySelection: undefined,
    searchType: undefined,
    productData: undefined,
    paymentInfo: {
        paymentAmount: 0,
        paymentType: "Pay Type",
        checkNumber: null,
    },
    storeCustomer: () => {},
    storeCategory: () => {},
    storeCart: () => {},
    storeCategorySelection: () => {},
    storeSearchType: () => {},
    storeCartTotalSales: () => {},
    storePaymentInfo: () => {},
})

export default orderContext