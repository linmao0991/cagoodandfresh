'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
//Associations

//customers has many accounts_payable_invoices association
db.customers.hasMany(accounts_payable_invoices, {sourceKey: 'customer_account_number', foreignKey: 'customerAccountNumber'});

//accounts_payable_invoices has many accounts_receivable_notes
db.accounts_payable_invoices.hasMany(accounts_receivable_notes, {sourceKey: 'invoice_number', foreignKey: 'ar_invoice_number'})

//accounts_payable_invoices has many ar_invoice_line_item
db.accounts_payable_invoices.hasMany(accounts_payable_invoices, { sourceKey: 'invoice_number', foreignKey: "ar_invoice_number"});

//ar_invoice_line_item has one inventory_transaction
db.ar_invoice_line_item.hasOne(inventory_transaction, { foreignKey: 'ar_invoice_line_item_id'});



//End Associations
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
