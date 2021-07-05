module.exports = function ( sequelize, DataTypes){
    var sales_revenue = sequelize.define("sales_revenue", {
        customer_account_number: {
            type: DataTypes.STRING(11),
            allowNull: false
        },
        credit: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        debit: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        //References are invice numbers of accounts_receivable_invoices, accounts_payable_invoies, utility account numbers
        //--Reference will be used to find the invoices cash is paid or received from
        ar_invoice_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ar_invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },{
        freezeTableName: true
    });
    return sales_revenue;
};