var express = require('express');
var router = express.Router();
var cors = require('cors');
router.options('*', cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'extrasyrup.xyz' });
});

/* SCRAPE: bettingpros */
var custom_controller = require('../controllers/custom');
router.get('/custom', custom_controller.index);
router.get('/fb', custom_controller.fb);

module.exports = router;