module.exports = function ( sequelize, DataTypes){
    var inventory_transaction = sequelize.define("inventory_transaction", {
        product_code: {
            type: DataTypes.STRING,
        },
        product_name_english: {
            type: DataTypes.STRING,
        },
        product_name_chinese: {
            type: DataTypes.STRING
        },
        upc: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.DECIMAL(10,2)
        },
        sale_price: {
            type: DataTypes.DECIMAL(19,4),
            defaultValue: 0
        },
        cost: {
            type: DataTypes.DECIMAL(19,4),
            defaultValue: 0
        },
        transaction_type: {
            type: DataTypes.STRING
        },
        measurement_system: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    },{
        freezeTableName: true
    });
    return inventory_transaction;
};