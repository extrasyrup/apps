const puppeteer = require('puppeteer');
const fs = require('fs');
const screenSizes = { large: { w: 1920, h: 4000 }, medium: { w: 1920, h: 2500 }, small: { w: 1920, h: 1080 } };
const regexArtist = /(^).*(?=-)/g, regexTrack = /(?<=-).*(?=\()/g, regexTrackAlt = /(?<=-).*(?=\[)/g, regexTrackAlt2 = /(?<=-).*(?=$)/g, regexMix = /(?<=\().*(?=\))/g, regexSpecial = /(?<=\[).*(?=\])/g;
const rootUrl = 'https://www.indianasbc.com/member-directory/page/2/?wpbdp_view=all_listings';

exports.index = (req, res) => { timeStamp();
    scrapePage();
    res.render('index', { title: 'SBC SCRAPER' });
}

    const scrapePage = async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let dataStore = [];

        const episodeCount = 1;
        const episodeMax = 1; //75
        const pageWaitInterval = 2000;
        
        console.log('Starting scrape...');
        for(let episodeNumber = episodeCount; episodeNumber <= episodeMax; episodeNumber++) {
            await page.goto(rootUrl/*  + episodeNumber */, { waitUntil: 'networkidle2' });
            let posts = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('.wpbdp-listing');
                items.forEach((item) => {
                    let title = function() {
                        return item.querySelector('.listing-title');
                    }
                    let website = item.querySelector('.wpbdp-field-website a');
                    results.push({
                        'title': title,
                        'website': typeof website,
                        //phone: item.querySelector('.wpbdp-field-phone .value').innerText
                    });
                });
                return results;
            });
            
            dataStore.push(posts);
            //await page.waitForTimeout(pageWaitInterval); //Self-imposed rate limit
        }

        console.log('Browser Closed.');
        await browser.close();

        let jsonContent = JSON.stringify(dataStore);
        function writeFile(fileName, content) {
            fs.writeFile(fileName, content, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            
                console.log("JSON file has been saved.");
            });
        }
        writeFile(`data/sbc/output.json`, jsonContent); timeStamp();

        return dataStore;
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