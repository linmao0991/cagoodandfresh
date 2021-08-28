module.exports = function ( sequelize, DataTypes){
    var accounts_payable_invoices = sequelize.define("accounts_payable_invoices", {
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        supplier_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        purchase_order_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        invoice_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        due_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        receive_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        invoice_total: {
            type: DataTypes.DECIMAL(19,4),
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
    return accounts_payable_invoices;
};