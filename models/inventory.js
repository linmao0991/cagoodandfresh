module.exports = function ( sequelize, DataTypes){
    var inventory = sequelize.define("inventory", {
        product_code: {
            type: DataTypes.STRING,
        },
        upc: {
            type: DataTypes.INTEGER
        },
        invoice_quantity: {
            type: DataTypes.INTEGER
        },
        current_quantity: {
            type: DataTypes.INTEGER
        },
        purchase_order_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // ap_invoice_number: {
        //     type: DataTypes.STRING
        // },
        receive_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        sale_price: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        supplier_id: {
            type: DataTypes.INTEGER
        }
    },{
        freezeTableName: true
    });
    return inventory;
};