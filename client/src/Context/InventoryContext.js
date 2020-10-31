import React from "react";

const inventoryContext = React.createContext({
    categories: undefined,
    testValue: undefined,
    storeCategory: () => {},
    storeTextValue: () => {}
})

export default inventoryContext