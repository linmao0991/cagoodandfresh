module.exports = function ( sequelize, DataTypes){
    var inventory_invoices = sequelize.define("inventory_invoices", {
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // supplier_id: {
        //     type: DataTypes.STRING,
        //     allowNull: true
        // },
        purchase_order_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        invoice_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        receive_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        invoice_total: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "UNPAID"
        }
    },{
        freezeTableName: true
    });
    return inventory_invoices;
};