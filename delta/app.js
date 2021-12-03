const puppeteer = require('puppeteer');
const screenSizes = { large: { w: 1920, h: 4000 }, medium: { w: 1920, h: 2500 }, small: { w: 1920, h: 1080 } };
const fs = require('fs');

(async () => { timeStamp();
    const browser = await puppeteer.launch(/*{ devtools: true, headless: false }*/);
    const page = await browser.newPage();
    await page.setViewport({ width: screenSizes.small.w, height: screenSizes.small.h });
    let dataPull = [];

    page.on('response', async function(response) {
        let responseUrl = response.url();
        dataPull.push(responseUrl);
        //console.log('      > ', responseUrl);
    });

    await page.goto('http://api.espn.com/v1/sports/football/nfl', { waitUntil: 'networkidle2' })
    .then(res => {
        console.log(res);

        //writeFile(`data/urls.json`, JSON.stringify(dataPull));

        browser.close();
    
        return dataPull;
    });
})();



function writeFile(fileName, content) {
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