module.exports = function ( sequelize, DataTypes){
    var accounts_receivable_invoices = sequelize.define("accounts_receivable_invoices", {
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        customer_account_number: {
            type: DataTypes.STRING(11),
            allowNull: true,
        },
        order_date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        delivery_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        pickup_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        invoice_total: {
            type: DataTypes.DECIMAL(19,4),
            allowNull: false,
            defaultValue: 0.0000
        },
        payment_status: {
            type: DataTypes.STRING,
            defaultValue: "UNPAID"
        },
        //In place for future use.
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    },
    {
        //Hooks to generate invoice number before validation.
        hooks: {
            beforeValidate: (accounts_receivable_invoices, options) => {
                let date = new Date();
                let year = date.getFullYear().toString().slice(2);
                let month = () => {
                  let m = date.getMonth()+1
                  console.log(m.toString().length)
                  return(m.toString().length > 1? m : ''+0+m)
                };
                let day = () => {
                  let d = date.getDate()
                  return(d.toString().length > 1? d : ''+0+d)
                };
                let hour = () => {
                  let h = date.getHours()
                  return(h.toString().length > 1? h : ''+0+h)
                };
                let minute = () => {
                  let m = date.getMinutes()
                  return(m.toString().length > 1? m : ''+0+m)
                };
                let second = () => {
                  let s = date.getSeconds()
                  return(s.toString().length > 1? s : ''+0+s)
                };
                accounts_receivable_invoices.invoice_number = year+month()+'-'+day()+hour()+minute()+second()
                    //possible format: yymmddhhmmss-customer_id (0921-042511-0001)
            }
        }
    },
    {
        freezeTableName: true
    });
    return accounts_receivable_invoices;
};