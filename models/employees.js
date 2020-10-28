var bcrypt = require("bcryptjs");
//TO DO

//-Check sequelize for parameters to check for unquie fields.
//
module.exports = function ( sequelize, DataTypes){
    var employees = sequelize.define("employees", {
        first_name: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        title: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        phone_number: {
            type: DataTypes.STRING(11),
            allowNUll: false
        },
        street: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        city: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        state: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        email: {
            type: DataTypes.STRING,
            allowNUll: true,
            validate: {
                isEmail: true
              }
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            allowNUll: false
        },
        permission_level: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pay_type: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        pay_rate: {
            type: DataTypes.DECIMAL(19,4),
            allowNUll: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNUll: true
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNUll: true
        },
        pin: {
            type: DataTypes.INTEGER,
            allowNUll: true
        },
        note: {
            type: DataTypes.STRING,
            allowNUll: true
        }
    },{
    //Stops sequelize auto-pluralization and keeps table name as model name.
    freezeTableName: true
    },{
        freezeTableName: true
    });

    employees.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
      };
    
    employees.addHook("beforeCreate", function (employees) {
        employees.password = bcrypt.hashSync(
            employees.password,
            bcrypt.genSaltSync(10),
            null
        );
    });

    return employees;
};