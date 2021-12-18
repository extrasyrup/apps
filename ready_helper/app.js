timeStamp('Start');
//const express = require('express');
//const app = express();
const request = require('request');
const Reddit = require('reddit');
const fs = require('fs');
const reddit = new Reddit({ username: 'i_am_extra_syrup', password: '@@Gr33nw00d!!', appId: 'xq1xMQqRkocVuYkQikZQxA', appSecret: '0XTCFV2DAml-EERvsLobyGlc6oKJkQ', userAgent: 'ready_helper/0.0.1 (https://extrasyrup.xyz/ready_helper/about.html)' });
let apiAfter = '', apiCount = 0, finalResult = [];

const apiLimit = 100, apiMax = 20;
const endpoints = ['coolguides', 'wallpaper', 'art', 'painting', 'mentalhealth', 'all', 'askreddit', 'HistoryPorn', 'DataHoarder'];
const endpoints_nft = ['NFT', 'NFTsMarketplace', 'NFTExchange', 'OpenSea', 'NFTmarket'];
const currentEndpoint = endpoints[0];
const rootImgDir = 'data/images/';
const savePath = rootImgDir + currentEndpoint;
const scrapeOptions = { 'images': false };

(function runApi(c) {
    console.log('Page: ' + c);

    if(c >= apiMax || apiAfter == null) {
        writeFile(`data/${currentEndpoint}-${getRnd(999999)}.json`, JSON.stringify(finalResult)); //Save all results to json file
        timeStamp('End');
        return
    }

    getRedditData(currentEndpoint, apiAfter, apiCount)
    .then(dataStore => {
        apiAfter = dataStore.after; 
        console.log('apiAfter: ' + apiAfter);
        apiCount += apiLimit;
        console.log('apiCount: ' + apiCount);

        dataStore.children.forEach(el => {
            if(el != null) {
                if(el.post_hint == 'image' && scrapeOptions.images == true) {
                    let saveFile = el.url.split('/');
                    if(!checkDir(savePath)) {
                        fs.mkdir(savePath, { recursive: true }, (err) => {
                            if (err) throw err;
                        });
                    }
                    const data = download(el.url, savePath + '/' + saveFile[saveFile.length-1]); //console.log(data);
                }
                finalResult.push(el); //Push current data page to storage array
            }
        });

        setTimeout(function() { console.log('Rate limiting...'); runApi(c + 1); }, 1000);
    });
})(0);

async function getRedditData(sub, apiAfter, apiCount) {
    return await reddit.get(`/r/${sub}/hot`, { 'limit': apiLimit, 'after': apiAfter, 'count': apiCount/* , 't': 'all' */ })
    .then(me => {
        return {
            'after': me.data.after,
            'children': me.data.children.map(el => {
                if(el.data.distinguished == null) {
                    return { 
                        "title": el.data.title || '',
                        "author": el.data.author || '',
                        //"selftext": el.data.selftext || '',
                        "upvote_ratio": el.data.upvote_ratio || 0.0,
                        "link_flair_text": el.data.link_flair_text || '',
                        "post_hint": el.data.post_hint || '',
                        "url": el.data.url || '',
                        "permalink": el.data.permalink || '',
                        "score": el.data.score || 0,
                        //"over_18": el.data.over_18 || false,
                        //"subreddit": el.data.subreddit || '',
                        "created_utc": el.data.created_utc || 0,
                        "name": el.data.name || ''
                    };
                } else {
                    return;
                }
            })
        }
    });
}

function writeFile(fileName, content) {
    fs.writeFile(fileName, content, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log(`JSON file has been saved: ${fileName}`);
    });
}

function checkDir(dir) {
    return fs.stat(dir, function(err) {
        if (!err) {
            //console.log('dir -true: ' + dir);
            return true;
        }
        else if (err.code === 'ENOENT') {
            //console.log('dir -false: ' + dir);
            return false;
        }
    });
}

function timeStamp(msg) {
    var currentdate = new Date(); 
    var datetime = "LAST STAMP: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    console.log('\n\n', '===', datetime, '=== ', msg, '\n');
}

function getRnd(max) {
    return Math.floor(Math.random() * max);
}

async function download(url, dest) {
    const file = fs.createWriteStream(dest);

    await new Promise((resolve, reject) => {
        request({
            uri: url,
            gzip: true,
        })
        .pipe(file)
        .on('finish', async () => {
            resolve(); //console.log(`The file is finished downloading: ${url}`);
        })
        .on('error', (error) => {
            reject(error);
        });
    })
    .catch((error) => {
        console.log(`Something happened: ${error}`);
    });
}



/* async function getRedditCommentData(sub, name) {
    return await reddit.get(sub + '/comments', { 'article': name, 'limit': 5 });;
} */

/* getRedditImageData(`/r/${currentEndpoint}`)
.then(dataStore => {
    const savePath = rootSaveDirectory + currentEndpoint;
    console.log(checkDir(savePath));
    if(checkDir(savePath)) {
        console.log('mkdir exists');
        getData();
    } else {
        fs.mkdir(savePath, { recursive: true }, (err) => {
            if (err) throw err;
            console.log('mkdir: ' + savePath);
            getData();
        });
    }

    function getData() {
        dataStore.forEach(el => {
            if(el.type == 'image') {
                let saveFile = el.image.split('/');
                (async () => {
                    const data = await download(el.image, rootSaveDirectory + el.sub + '/' + saveFile[saveFile.length-1]); //console.log(data);
                })();
            }
        });

        writeFile(`data/${currentEndpoint.replace(/\//g, '-')}.json`, JSON.stringify(dataStore));
    }
}); */

/* (async () => {
    const data = await download(el.image, rootImgDir + currentEndpoint + '/' + saveFile[saveFile.length-1]); //console.log(data);
})(); */

/*
function catalogKeywords(dataStore) {
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g; //Regex for punctuation
    const wordDb = new Array();
    console.log(dataStore);
    dataStore.data.forEach(el => {
        let textClean = el.selftext.replace(regex, '');  //Remove all punctuation
        let arrayClean = textClean.split(' '); //Split the content into a word array
        let arrayUnique = [...new Set(arrayClean)]; //Create new unique array from spreading a Set

        arrayUnique.forEach(el => {
            const newEntry = {
                'word': el.toLowerCase(),
                'count': 1
            }

            let wordSearch = wordDb.find(item => item.word == newEntry.word);
            if(!wordSearch) {
                wordDb.push(newEntry);
            } else {
                wordSearch.count++;
            }
        });
    });

    //console.log(`wordDb.length: ${wordDb.length} `);
    //let wordSearch = wordDb.find(item => item.word == 'suicide');
    console.log(wordDb);
    writeFile(`data/mentalhealth-keywords.json`, JSON.stringify(wordDb));
}
*/
