var express = require('express');
var router = express.Router();

const app = express();
const puppeteer = require('puppeteer');

var marketplace_controller = require('../controllers/marketplaceController');
app.get('/', marketplace_controller.index);

module.exports = app;