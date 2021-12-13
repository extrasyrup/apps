const fs = require('fs');
const {Client} = require("@googlemaps/google-maps-services-js"); // AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc
const axios = require('axios');
const apiMaxPages = 4;
let apiAfter = '', finalResult = [];
let config = {
  method: 'get',
  url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=39.5983379%2C-86.1199478&radius=10000&&key=AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc',
  headers: { }
};

timeStamp();

(function runApi(c) {
    if(c >= apiMaxPages) { return; }

    axios(config)
    .then(function (response) {
        apiAfter = response.data.next_page_token;
        config.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc&pagetoken=${apiAfter}`; //Update 'after' for next page
        writeFile(`data/places-${getRnd(999999)}-${c}.json`, JSON.stringify(response.data)); //Save all results to json file
        setTimeout(function() { console.log('Rate limiting...'); runApi(c + 1); }, 3000); //Set to a minimum of 2 seconds to respect the api timing
        console.log('Page: ' + c);
    })
    .catch(function (error) { console.log(error); });
})(0);

async function getData() {
    return;
}

function writeFile(fileName, content) { //Utility function to save data to json file
    fs.writeFile(fileName, content, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log(`JSON file has been saved: ${fileName}`);
    });
}

function getRnd(max) {
    return Math.floor(Math.random() * max);
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