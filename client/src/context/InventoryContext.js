import React from "react";

const inventoryContext = React.createContext({
    categories: undefined,
    permission_level: undefined,
    products: undefined,
    inventory: undefined,
    productSuppliers: undefined,
    selectedProduct: undefined,
    //Used for creating new inventory, but new accounts payable invoice record must be created fiest
    newInvoiceDetails: {
        invoice_number: undefined,
        purchase_order_number: undefined,
        invoice_date: undefined,
        due_date: undefined,
        receive_date: undefined,
        account_number: undefined,
        invoice_total: undefined,
        payment_status: undefined,
        supplier_id: undefined,
        paid_amount: undefined,
        supplier_name: undefined,
    },
    //Each item on invoice is an object pushed into an array
    newInvoiceItems: [
        {
            //Same as product.id
            product_code: undefined,
            name_english: undefined,
            name_chinese: undefined,
            upc: undefined,
            invoice_quantity: undefined,
            purchase_order_number: undefined,
            //ap_invoice_number is the same as newInvoiceDetails.invoice_number
            ap_invoice_number: undefined,
            receive_date: undefined,
            cost: undefined,
            sale_price: undefined,
            supplier_id: undefined,
            supplier_name: undefined,
        },
    ],
    storeProducts: () => {},
    storeInventory: () => {},
    storeProductSuppliers: () => {},
    storeSelectedProduct: () => {},
    storeNewInvoiceDetails: () => {},
    storeNewInvoiceItems: () => {},
})

export default inventoryContext