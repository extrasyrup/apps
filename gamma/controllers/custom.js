const puppeteer = require('puppeteer');
const screenSizes = { large: { w: 1920, h: 4000 }, medium: { w: 1920, h: 2500 }, small: { w: 1920, h: 1080 } };
const fs = require('fs');

exports.index = (req, res) => { timeStamp();
    scrapePage();
    res.render('index', { title: 'CUSTOM SCRAPER' });
}

    const scrapePage = async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let dataStore = [];

        const episodeCount = 134;
        const episodeMax = 134;
        const pageWaitInterval = 4000;
        
        console.log('Starting scrape...');
        for(let episodeNumber = episodeCount; episodeNumber <= episodeMax; episodeNumber++) {
            //try {
            await page.goto('https://www.miroppb.com/ASOT/' + episodeNumber, { waitUntil: 'networkidle2' });
            await page.$eval('#info_table td:first-child', el => { 
                let pos1 = parseInt(el.textContent.indexOf('Release Date:')) + 13; 
                let pos2 = parseInt(el.textContent.indexOf('\n', pos1)); 
                return el.textContent.substr(pos1, pos2 - pos1).trim() || 'n/a'; 
            })
            .then(async (releaseDate) => {
                let trackList = await page.$$eval('#tracklist ol li', (els) => { return els.map((el, index) => {
                    let fullTitle, artistName, trackName, specialName;
                    fullTitle = el.textContent.replace(' – ', ' - ').trim();

                    if(fullTitle.indexOf('-')) {
                        artistName = fullTitle.split(' - ')[0] || 'n/a';
                        trackName = fullTitle.split(' - ')[1] || 'n/a';
                        
                        if(trackName.indexOf('[')) {
                            specialName = trackName.split('[')[1] || 'n/a';
                            trackName = trackName.split('[')[0] || 'n/a';
                        }
                    }
                    return {
                        'trackNumber': index + 1,
                        'artistName': artistName.trim(), 
                        'trackName': trackName.trim(), 
                        'specialName': specialName.replace(']', '').trim() 
                    };
                } ) });

                trackList.forEach(el => { el['releaseDate'] = releaseDate; el['episodeNumber'] = episodeNumber;  });
                dataStore.push(trackList);

                //console.log(dataStore);
                console.log('Saved Episode #' + episodeNumber);
            });
            
            await page.waitForTimeout(pageWaitInterval); //Self-imposed rate limit
        }

        console.log('Browser Closed.');
        await browser.close();

        var jsonContent = JSON.stringify(dataStore);
        function writeFile(fileName, content) {
            fs.writeFile(fileName, content, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            
                console.log("JSON file has been saved.");
            });
        }
        writeFile(`output_${episodeCount}-${episodeMax}.json`, jsonContent);

        return dataStore;
    }


exports.fb = (req, res) => {
    getPageListings();
    res.render('index', { title: 'FB SCRAPER' });
}

    const getPageListings = async () => {
        const browser = await puppeteer.launch(/*{ devtools: true, headless: false }*/);
        const page = await browser.newPage();
        await page.setViewport({ width: screenSizes.small.w, height: screenSizes.small.h });
        let dataPull = [];

        page.on('response', async function(response) {
            let responseUrl = response.url(); //console.log('Response URL...', responseUrl);

            if(responseUrl.includes('https://api.bettingpros.com/v3/pbcs?sport=NBA&')) {
                //let resJson = await response.text().then((value) => console.log(value));
                let resStatus = response.initiator; console.log('resStatus: ' + resStatus);
            }
        });

        await page.goto('https://www.bettingpros.com/nba/picks/prop-bets/?date=2021-11-18', { waitUntil: 'networkidle2' }); //Load webpage
        //console.log('dataPull... ', dataPull);
        browser.close();

        return dataPull;
    }


exports.nodemail = (req, res) => {
    main().catch(console.error);
    res.render('index', { title: 'NODEMAIL' });
}

    const nodemailer = require("nodemailer");
    async function main() {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.dreamhost.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'relay@extrasyrup.xyz',
                pass: '@@Ital1an!!'
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Message Relay" <relay@extrasyrup.xyz>', // sender address
            to: "udoobu@gmail.com", // list of receivers
            subject: "Hello", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>" // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
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