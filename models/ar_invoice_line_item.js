module.exports = function ( sequelize, DataTypes){
    var ar_invoice_line_item = sequelize.define("ar_invoice_line_item", {
        // invoice_number: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        customer_account_number: {
            type: DataTypes.STRING(11),
            allowNull: true
        },
        order_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        delivery_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        inventory_id: {
            type: DataTypes.INTEGER,
        }
        ,
        product_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        product_name_english: {
            type: DataTypes.STRING,
        },
        product_name_chinese: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        upc: {
            type: DataTypes.STRING
        },
        quantity: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        sale_price: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        },
        cost: {
            type: DataTypes.DECIMAL(10,2),
            defaultValue: 0
        }
    },{
        freezeTableName: true
    });
    return ar_invoice_line_item;
};