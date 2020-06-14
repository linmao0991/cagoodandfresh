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

//customers has many accounts_receivable_invoices association
db.customers.hasMany(db.accounts_receivable_invoices, {sourceKey: 'customer_account_number', foreignKey: 'customer_account_number'});

//accounts_receivable_invoices has many accounts_receivable_notes
db.accounts_receivable_invoices.hasMany(db.accounts_receivable_notes, {sourceKey: 'invoice_number', foreignKey: 'ar_invoice_number'});

//accounts_receivable_invoices has many ar_invoice_line_item
db.accounts_receivable_invoices.hasMany(db.ar_invoice_line_item, { sourceKey: 'invoice_number', foreignKey: "ar_invoice_number"});

//ar_invoice_line_item has one inventory_transaction
db.ar_invoice_line_item.hasOne(db.inventory_transaction, { foreignKey: 'ar_invoice_line_item_id'});

//suppliers has many accounts_payable_invoices
db.suppliers.hasMany(db.accounts_payable_invoices, {foreignKey: 'supplier_id'});

//accounts_payable_invoices has many inventory
db.accounts_payable_invoices.hasMany(db.inventory, {sourceKey: 'invoice_number', foreignKey: 'ar_invoice_number'})

//End Associations
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
