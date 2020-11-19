import React from "react";

const inventoryContext = React.createContext({
    categories: undefined,
    testValue: undefined,
    permission_level: undefined,
    storeCategory: () => {},
    storeTextValue: () => {}
})

export default inventoryContext