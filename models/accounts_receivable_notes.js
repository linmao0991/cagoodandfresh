module.exports = function ( sequelize, DataTypes){
    var accounts_receivable_notes = sequelize.define("accounts_receivable_notes", {
        // invoice_number: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     unique: true
        // },
        customer_account_numeber: {
            type: DataTypes.STRING(11),
            allowNull: true
        },
        //In place for future use.
        employee: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },{
        freezeTableName: true
    });
    return accounts_receivable_notes;
};