import React from "react";

const inventoryContext = React.createContext({
    categories: undefined,
    permission_level: undefined,
    products: undefined,
    inventory: undefined,
    storeProducts: () => {},
    storeInventory: () => {}
})

export default inventoryContext