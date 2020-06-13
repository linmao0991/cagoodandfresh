// Requiring our models and passport as we've configured it
require('dotenv').config();
var db = require("../../models");
//var passport = require("../../config/passport");
var router = require("express").Router();
const { Op } = require("sequelize");

module.exports = router;
