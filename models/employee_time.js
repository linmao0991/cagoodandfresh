module.exports = function ( sequelize, DataTypes){
    var employee_time = sequelize.define("employee_time", {
        time_in: {
            type: DataTypes.DATE,
            allowNull: true
        },
        time_out: {
            type: DataTypes.DATE,
            allowNull:true
        },
        pay_rate: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        }
    },{
        freezeTableName: true
    });
    return employee_time;
};