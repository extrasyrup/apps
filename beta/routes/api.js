var express = require('express');
var router = express.Router();

// Require controller modules.
var marketplace_controller = require('../controllers/marketplaceController');

// GET home page.
router.get('/', marketplace_controller.index);

// GET request for creating Item. NOTE This must come before route for id (i.e. display author).
router.get('/item/create', marketplace_controller.item_create_get);

// POST request for creating Item.
router.post('/item/create', marketplace_controller.item_create_post); //KEEP OG ROUTE

// GET request to delete Item.
router.get('/item/:id/delete', marketplace_controller.item_delete_get);

// POST request to delete Item.
router.post('/item/:id/delete', marketplace_controller.item_delete_post);

// GET request to update Item.
router.get('/item/:id/update', marketplace_controller.item_update_get);

// POST request to update Item.
router.post('/item/:id/update', marketplace_controller.item_update_post);

// GET request for one Item.
router.get('/item/:id', marketplace_controller.item_detail);

// GET request for list of all Item.
router.get('/item', function(req, res, next) {
    const mpData = marketplace_controller.item_list().then(function(response) {
        console.log('mpData... ', response.length /*, response*/);
        res.render('index', { title: 'FB Market Watch', message: 'Latest Listings:', data: JSON.stringify(response) });
    });
});

module.exports = router;