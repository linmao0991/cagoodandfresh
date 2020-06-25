module.exports = function ( sequelize, DataTypes){
    var accounts_receivable_invoices = sequelize.define("accounts_receivable_invoices", {
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        customer_account_number: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        order_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        delivery_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        pickup_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        invoice_total: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: 0
        },
        payment_status: {
            type: DataTypes.STRING,
            defaultValue: "UNPAID"
        },
        //In place for future use.
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    },{
        freezeTableName: true
    });
    return accounts_receivable_invoices;
};