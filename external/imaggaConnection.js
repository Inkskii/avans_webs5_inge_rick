const got = require('got');
const express = require('express');
let router = express.Router();
const apiKey = "acc_4035c86b0aa8ded";
const apiSecret = "c0ca185e612bb8e973c5a1dd94456635";
const url = 'https://api.imagga.com/v2/tags?image_url=';

async function getTags(uri) {
    try {
        const response = await got(url + encodeURIComponent(uri), { username: apiKey, password: apiSecret })
        return response.body;
    }
    catch (error) {
        console.log(error.response.body);
    }
}

module.exports.getTags = getTags;