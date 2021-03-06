//TO DO
//-Check sequelize for parameters to check for unquie fields.
//
module.exports = function ( sequelize, DataTypes){
    var suppliers = sequelize.define("suppliers", {
        name_english: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        name_chinese: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        contact_first_name: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        contact_last_name: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        contact_phone_number: {
            type: DataTypes.STRING(11),
            allowNUll: false
        },
        billing_street: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        billing_city: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        billing_state: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        billing_zipcode: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        business_phone_number: {
            type: DataTypes.STRING(11),
            required: true,
            allowNUll: false
        },
        fax_number: {
            type: DataTypes.STRING(11),
            required: true,
            allowNUll: false
        },
        email: {
            type: DataTypes.STRING,
            allowNUll: true,
            validate: {
                isEmail: true
              }
        },
        account_number: {
            type: DataTypes.STRING
        },
        products: {
            type: DataTypes.STRING(2000),
            allowNUll: true,
        }
    },{
    //Stops sequelize auto-pluralization and keeps table name as model name.
    freezeTableName: true
    },{
        freezeTableName: true
    });
    return suppliers;
};