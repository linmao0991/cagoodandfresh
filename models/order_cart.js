module.exports = function ( sequelize, DataTypes){
    var order_cart = sequelize.define("order_cart", {
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        customer_account_number: {
            type: DataTypes.STRING(11),
            allowNull: true
        },
        product_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        inventory_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sales_price: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
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
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        }
    },{
        freezeTableName: true
    });
    return order_cart;
};