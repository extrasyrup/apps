const puppeteer = require('puppeteer');
const screenSizes = { large: { w: 1920, h: 4000 }, medium: { w: 1920, h: 2500 }, small: { w: 1920, h: 1080 } };
const db = require('../bin/db');
const FbookModel = require('../models/db/fbook');
var MarketplaceItem = require('../models/marketplaceItemModel');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all items.
exports.item_list = function(req, res) { timeStamp();
    return getPageListings();
};

    const getPageListings = async () => {
        const browser = await puppeteer.launch(/*{ devtools: true, headless: false }*/);
        const page = await browser.newPage();
        await page.setViewport({ width: screenSizes.small.w, height: screenSizes.small.h });
        let dataPull = [];
        page.on('response', async function(response) {
            let responseUrl = response.url(); //console.log('Response URL...', responseUrl);

            if(responseUrl == 'https://www.facebook.com/api/graphql/') {
                let resJson = await response.json(); //console.log(resJson);
        
                if(typeof(resJson.data.marketplace_search) != 'undefined') { console.log('Data present...', Object.keys(resJson.data));
                    let tempData = resJson.data.marketplace_search.feed_units.edges;
                    tempData.forEach(element => { dataPull.push(element.node.listing); });
                } else {
                    console.log('No marketplace data in graphql call; skipping...', Object.keys(resJson.data)); 
                }
            }
        });
        await page.goto('https://www.facebook.com/marketplace/category/video-games-consoles/', { waitUntil: 'networkidle2' }); //Load webpage
        //console.log('dataPull... ', dataPull);
        browser.close();
        insertMpData(dataPull);
        return dataPull;
    }


// Display item create form on GET.
exports.item_create_get = function(req, res) { timeStamp();
    let fbItems = [];

    let fbItem1 = new FbookModel({
        fbId: 1876543211234567890,
        fbCatId: 1234567890098765432,
        listingTitle: 'Test Item A',
        formattedPrice: '$900',
        city: 'Indianapolis',
        state: 'IN',
        scanCount: 3
    });
    let fbItem2 = new FbookModel({
        fbId: 2876543211234567890,
        fbCatId: 2234567890098765432,
        listingTitle: 'Test Item B',
        formattedPrice: '$800',
        city: 'Greenwood',
        state: 'IN',
        scanCount: 2
    });
    let fbItem3 = new FbookModel({
        fbId: 3876543211234567890,
        fbCatId: 3234567890098765432,
        listingTitle: 'Test Item C',
        formattedPrice: '$700',
        city: 'Noblesville',
        state: 'IN',
        scanCount: 1
    });

    fbItems.push(fbItem1, fbItem2, fbItem3);

    let insertItems = insertMpData(fbItems);
    res.send(JSON.stringify(insertItems));
};

    const insertMpData = async (fbCollection) => {
        console.log(fbCollection);

        return await FbookModel.insertMany(fbCollection, function(err, docs) {
            if (err) return handleError(err);
            return docs;
        });
        
        /*return await fbCollection.save(function(err) {
            if (err) return handleError(err);
            return '== OK! ==';
        });*/
    }

    function handleError(err) {
        return 'ERROR!';
    }
  

// Display detail page for a specific item.
exports.item_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: item detail: ' + req.params.id);
};

// Handle item create on POST.
exports.item_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item create POST');
};

// Display item delete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete GET');
};

// Handle item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item delete POST');
};

// Display item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: item update GET');
};

// Handle item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: item update POST');
};

function timeStamp() {
    var currentdate = new Date(); 
    var datetime = "LAST STAMP: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    console.log('\n\n\n\n', '===', datetime, '===', '\n');
}