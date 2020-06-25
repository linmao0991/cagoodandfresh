//TO DO
//-Check sequelize for parameters to check for unquie fields.
//
module.exports = function ( sequelize, DataTypes){
    var customers = sequelize.define("customers", {
        customer_account_number: {
            //customer account number is the same as business phone number
            type: DataTypes.STRING(11),
            //required: true,
            allowNUll: false,
            unique: true
        },
        customer_representative: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        price_tier: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        restaurant_name_english: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        restaurant_name_chinese: {
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
        delivery_street: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        delivery_city: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        delivery_state: {
            type: DataTypes.STRING,
            allowNUll: true
        },
        delivery_zipcode: {
            type: DataTypes.INTEGER,
            allowNUll: true
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
            type: DataTypes.INTEGER,
            allowNUll: true
        },
        business_phone_number: {
            type: DataTypes.STRING(11),
            required: true,
            allowNUll: false
        },
        business_fax_number: {
            type: DataTypes.STRING(11),
            required: false,
            allowNUll: true
        },
        contact_phone_number: {
            type: DataTypes.STRING(11),
            allowNUll: true
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNUll: true,
            validate: {
                isEmail: true
              }
        },
        order_day_one: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        delivery_day_one: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        order_day_two: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        delivery_day_two: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        order_day_three: {
            type: DataTypes.STRING,
            allowNUll: true,
        },
        delivery_day_three: {
            type: DataTypes.STRING,
            allowNUll: true,
        }
    },{
    //Stops sequelize auto-pluralization and keeps table name as model name.
    freezeTableName: true
    });
    return customers;
};