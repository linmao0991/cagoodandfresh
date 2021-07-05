module.exports = function ( sequelize, DataTypes){
    var accounts_payable = sequelize.define("accounts_payable", {
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
        check: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        cash: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: true
        },
        check_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        check_memo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        invoice: {
            type: DataTypes.STRING,
            allowNull: false
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },{
        freezeTableName: true
    });
    return accounts_payable;
};