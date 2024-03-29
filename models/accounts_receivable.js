module.exports = function ( sequelize, DataTypes){
    return sequelize.define("accounts_receivable", {
        date: {
            type: DataTypes.STRING,
            allowNull: true
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
        //Reference to accounts_receivable_invoice
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
};