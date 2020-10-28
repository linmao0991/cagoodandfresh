module.exports = function ( sequelize, DataTypes){
    var products = sequelize.define("products", {
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        upc: {
            type: DataTypes.STRING,
            allowNull: true,
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
        holding: {
            type: DataTypes.STRING,
        },
        measurement_system: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplier_primary_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        supplier_secondary_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        supplier_tertiary_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },{
        freezeTableName: true
    });
    return products;
};