const fs = require('fs');
const {Client} = require("@googlemaps/google-maps-services-js"); // AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc
const axios = require('axios');
const apiMaxPages = 2;
let apiAfter = '', finalResult = [];
let config = {
  method: 'get',
  url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=39.5983379%2C-86.1199478&radius=6n000&&key=AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc',
  headers: { }
};

(function runApi(c) {
    console.log('Page: ' + c);
    if(c >= apiMaxPages) { return; }

    axios(config)
    .then(function (response) {
        console.log('config.url: ', config.url);
        config.url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${response.data.next_page_token}&key=AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc`; //Update 'after' for next page
        
        console.log('config.url: ', config.url);
        writeFile(`data/places-${getRnd(999999)}.json`, JSON.stringify(response.data)); //Save all results to json file
        runApi(c+1); //Call runApi() for next data call
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
        console.log("JSON file has been saved.");
    });
}

function getRnd(max) {
    return Math.floor(Math.random() * max);
}