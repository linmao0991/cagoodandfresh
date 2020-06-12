module.exports = function ( sequelize, DataTypes){
    var inventory_transactions = sequelize.define("inventory_transactions", {
        ar_invoice_number: {
            type: DataTypes.INTEGER
        },
        ar_invoice_line_item_id: {
            type: DataTypes.INTEGER
        },
        inventory_id: {
            type: DataTypes.INTEGER
        },
        product_code: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        sale_price: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        transaction_type: {
            type: DataTypes.STRING
        }
    });
    return inventory_transactions;
};