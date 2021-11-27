timeStamp();
const Reddit = require('reddit');
const request = require('request');
const fs = require('fs');
const reddit = new Reddit({
  username: 'i_am_extra_syrup',
  password: '@@Gr33nw00d!!',
  appId: 'xq1xMQqRkocVuYkQikZQxA',
  appSecret: '0XTCFV2DAml-EERvsLobyGlc6oKJkQ',
  userAgent: 'ready_helper/0.0.1 (https://extrasyrup.xyz/ready_helper/about.html)'
});
const endpoints = ['wallpaper', 'art', 'painting', 'mentalhealth'];
const currentEndpoint = `/r/${endpoints[3]}/new`;
const rootImgDir = 'data/images/';
let apiAfter = '', apiLimit = 100, apiMax = 200;
let finalResult = new Array();

(function runApi(c) {
    if(c >= apiMax) {
        writeFile(`data/mentalhealth.json`, JSON.stringify(finalResult)); //Save all results to json file
        //catalogKeywords(finalResult);
        return //Finished
    }
    console.log('c: ' + c);

    getRedditData(currentEndpoint, apiAfter).then(dataStore => {
        apiAfter = dataStore.data.after;
        finalResult.push(dataStore.data.children);
        runApi(c + apiLimit);
    });
})(0);

async function getRedditData(sub, apiAfter) {
    
    return await reddit.get(sub, { 'limit': apiLimit, 'after': apiAfter }); /*.then(me => me.data.children.map(el => {
        return {
            'text': el.data.selftext || '',
            'payload': el.data
        }
    }));*/
}


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


/*async function getRedditData(sub) {
    return await reddit.get(sub, { limit: 10 }).then(me => me.data.children.map((el, index) => {
        return {
            name: el.data.name || 'n/a',
            title: el.data.title || 'n/a',
            image: el.data.url || '',
            sub: el.data.subreddit || '',
            type: el.data.post_hint || '',
            payload: el.data || 'n/a'
        }
    }));
}

getRedditData(`/r/${currentEndpoint}/hot`).then(dataStore => {
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
});

function checkDir(dir) {
    return fs.stat(dir, function(err) {
        if (!err) {
            console.log('dir -true: ' + dir);
            return true;
        }
        else if (err.code === 'ENOENT') {
            console.log('dir -false: ' + dir);
            return false;
        }
    });
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
            resolve(); //console.log(`The file is finished downloading.`);
        })
        .on('error', (error) => {
            reject(error);
        });
    })
    .catch((error) => {
        console.log(`Something happened: ${error}`);
    });
}*/

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