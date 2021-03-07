const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = "e910cb2acb126b2298fdc2b54def63ab";

async function getCoordsForAddress(address) {

    return {
        lat:40.7484,
        lag:-2223.22
    };

    // const params = {
    //     access_key: API_KEY,
    //     query: address,
    //     limit: 1
    //   }

    // let dat;

    // axios.get('https://api.positionstack.com/v1/forward', {params})
    // .then(response => {
    //   console.log(response.data);
    //   dat = response.data;
    // }).catch(error => {
    //   console.log(error);
    // });

    // if(!dat) {
    //     const error = new HttpError('Could not find the coordinates for the given address. Please check the address again and retry.', 422);
    //     throw error;
    // }

    // const coordinates = [
    //     response.data.results.latitude,
    //     response.data.results.longitude
    // ];

    // return coordinates;
}

module.exports = getCoordsForAddress;