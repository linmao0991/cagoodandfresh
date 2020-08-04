module.exports = function ( sequelize, DataTypes){
    var collections = sequelize.define("collections", {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        collection_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        check: {
            type: DataTypes.BOOLEAN,
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
        cash: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },{
        freezeTableName: true
    });
    return collections;
};