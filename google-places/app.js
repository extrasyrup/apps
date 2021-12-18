const fs = require('fs');
const {Client} = require("@googlemaps/google-maps-services-js"); // AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc
const { Parser } = require('json2csv');
const axios = require('axios');
const apiMaxPages = 3;
const baseURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const key = 'AIzaSyDFn08wR53O-_nEOB52cxwgBIvjR5ktKkc';
let apiAfter = '', finalResult = [];
//let location = '39.5983379,-86.1199478'; //Greenwood, IN
//let location = '39.7797003,-86.2728328'; //Indianapolis, IN
let location = '39.1564772,-75.5484393'; //Dover, DE
let radius = '8000'; //In meters
//let types = ['accounting','airport','amusement_park','aquarium','art_gallery','atm','bakery','bank','bar','beauty_salon','bicycle_store','book_store','bowling_alley','bus_station','cafe','campground','car_dealer','car_rental','car_repair','car_wash','casino','cemetery','church','city_hall','clothing_store','convenience_store','courthouse','dentist','department_store','doctor','drugstore','electrician','electronics_store','embassy','fire_station','florist','funeral_home','furniture_store','gas_station','gym','hair_care','hardware_store','hindu_temple','home_goods_store','hospital','insurance_agency','jewelry_store','laundry','lawyer','library','light_rail_station','liquor_store','local_government_office','locksmith','lodging','meal_delivery','meal_takeaway','mosque','movie_rental','movie_theater','moving_company','museum','night_club','painter','park','parking','pet_store','pharmacy','physiotherapist','plumber','police','post_office','primary_school','real_estate_agency','restaurant','roofing_contractor','rv_park','school','secondary_school','shoe_store','shopping_mall','spa','stadium','storage','store','subway_station','supermarket','synagogue','taxi_stand','tourist_attraction','train_station','transit_station','travel_agency','university','veterinary_care','zoo'];
let types = ['hospital', 'physiotherapist', 'doctor', 'health'];
let typesCnt = 0;
let config = {
    method: 'get',
    url: `${baseURL}location=${location}&radius=${radius}&key=${key}&type=${types[typesCnt]}`,
    headers: { }
};

timeStamp();
runApi(0, types[typesCnt]);

function runApi(c, type) {
    if(c >= apiMaxPages) {
        writeFile(`data/places-${type}-${getRnd(999)}.csv`, finalResult); //Save all results to csv file
        //writeFile(`data/places-${type}-${getRnd(999)}.json`, JSON.stringify(finalResult)); //Save all results to json file
        typesCnt++; //Increase to next type and run again
        if(typesCnt < types.length) {
            finalResult = []; //Empty data array
            config.url = `${baseURL}location=${location}&radius=${radius}&key=${key}&type=${types[typesCnt]}`; //Update config.url for next Type
            runApi(0, types[typesCnt]);
        }
        return; 
    }
    //console.log('\nConfig URL: ', config.url);
    axios(config)
    .then(function (response) {
        let results = response.data.results;
        //console.log('Response: ', results.length);

        if(results.length > 0) {
            apiAfter = response.data.next_page_token;
            
            config.url = `${baseURL}key=${key}&pagetoken=${apiAfter}`; //Update 'after' for next page
            finalResult.push(...results);
            /* finalResult.push(...results.map(el => {
                return {
                    'name': el.name,
                    "vicinity": el.vicinity,
                    "rating": el.rating,
                    "business_status": el.business_status,
                    "place_id": el.place_id
                }
            })); */
            setTimeout(function() { /* console.log('Rate limiting...'); */ runApi(c + 1, types[typesCnt]); }, 3000); //Set to a minimum of 2 seconds to respect the api timing
            console.log('Page: ' + c);
        } else {
            c = apiMaxPages;
            runApi(c, types[typesCnt]);
            console.log('\nPaging done: ' + c);
        }
    })
    .catch(function (error) { console.log(error); });
}

async function getData() {
    return;
}

function writeFile(fileName, content) { //Utility function to save data to json file
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(content);

    fs.writeFile(fileName, csv, 'utf8', function (err) {
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