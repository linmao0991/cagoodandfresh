module.exports = function ( sequelize, DataTypes){
    var accounts_payable_notes = sequelize.define("accounts_payable_notes", {
        // invoice_number: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     unique: true
        // },
        supplier_id: {
            type: DataTypes.INTEGER,
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
    return accounts_payable_notes;
};