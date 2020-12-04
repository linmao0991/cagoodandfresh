import React from "react";

const inventoryContext = React.createContext({
    categories: undefined,
    permission_level: undefined,
    products: undefined,
    inventory: undefined,
    productSuppliers: undefined,
    selectedProduct: undefined,
    storeProducts: () => {},
    storeInventory: () => {},
    storeProductSuppliers: () => {},
    storeSelectedProduct: () => {}
})

export default inventoryContext