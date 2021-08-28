export const resetInventoryDetails = context => {
    context.storeNewInvoiceDetails({
        ap_invoice_number: null,
        purchase_order_number: null,
        invoice_date: null,
        due_date: null,
        receive_date: null,
        account_number: null,
        invoice_total: 0,
        payment_status: null,
        supplier_id: null,
        paid_amount: 0,
        supplier_name: null,
    })
}