module.exports = function ( sequelize, DataTypes){
    var cash = sequelize.define("cash", {
        //Account is referenced to corresponding ledgar entry. IE accounts_receivable, accounts_payable, expenses
        account: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //Foreign Key
        //linked to the primary Key of the account above
         account_id: {
             type: DataTypes.INTEGER,
             allowNUll: false
        },
        credit: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        debit: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        check: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        cash: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        check_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        //References are invice numbers of accounts_receivable_invoices, accounts_payable_invoies, utility account numbers
        //--Reference will be used to find the invoices cash is paid or received from
        reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Foreign Key to associate with 
        reference_id: {
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
    return cash;
};