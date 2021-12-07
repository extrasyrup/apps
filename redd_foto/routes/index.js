timeStamp();
const express = require('express');
const router = express.Router();
const Reddit = require('reddit');
const reddit = new Reddit({ username: 'i_am_extra_syrup', password: '@@Gr33nw00d!!', appId: 'xq1xMQqRkocVuYkQikZQxA', appSecret: '0XTCFV2DAml-EERvsLobyGlc6oKJkQ', userAgent: 'ready_helper/0.0.1 (https://extrasyrup.xyz/ready_helper/about.html)' });
const fs = require('fs');

router.get('/', function(req, res, next) {
  getData().then(() => {
    res.render('index', { title: 'REDD FOTO', message: 'Hello, there!', data: JSON.stringify(data) });
  });
});

function getData() {
  const endpoints = ['wallpaper', 'art', 'painting', 'mentalhealth'];
  const currentEndpoint = `/r/${endpoints[0]}/new`;
  const rootImgDir = 'data/images/';
  let apiAfter = '', apiLimit = 100, apiMax = 100, finalResult = [];
  
  (function runApi(c) {
      console.log('Page: ' + c);
  
      if(c >= apiMax) {
          writeFile(`data/wallpaper.json`, JSON.stringify(finalResult)); //Save all results to json file
          return;
      }
  
      getRedditData(currentEndpoint, apiAfter)
      .then(dataStore => {
          apiAfter = dataStore.after;
          dataStore.children.forEach(el => finalResult.push(el));
          runApi(c + apiLimit);
      });
  })(0);
  
  async function getRedditData(sub, apiAfter) {
      return await reddit.get(sub, { 'limit': apiLimit, 'after': apiAfter })
      .then(me => {
          return {
              'after': me.data.after,
              'children': me.data.children.map(el => {
                  return el.data.url;
              })
          }
      });
  }

  return finalResult;
}

function writeFile(fileName, content) { //Utility function to save data to json file
    fs.writeFile(fileName, content, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}

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

module.exports = router;