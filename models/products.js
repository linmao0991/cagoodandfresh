const { daemon } = require("cli");

module.exports = function ( sequelize, DataTypes){
    var product = sequelize.define("product", {
        product_code: {
            type: DataTypes.STRING,
            unique: true
        },
        location: {
            type: DataTypes.STRING,
        },
        upc: {
            type: DataTypes.INTEGER
        },
        name_english: {
            type: DataTypes.STRING
        },
        name_chinese: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING,
        },
        measurement_system: {
            type: DataTypes.STRING,
        },
        weight: {
            type: DataTypes.FLOAT,
        },
        description: {
            type: DataTypes.STRING
        },
        supplier_primary_id: {
            type: DataTypes.INTEGER
        },
        supplier_secondary_id: {
            type: DataTypes.INTEGER
        },
        supplier_tertiary_id: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.INTEGER
        }
    },{
        freezeTableName: true
    });
    return product;
};