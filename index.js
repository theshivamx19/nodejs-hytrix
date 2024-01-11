// const { default: axios } = require('axios')
const axios = require('axios');
const express = require('express')
const app = express()

app.get('/map', (req, res) => {
    const apiKey = 'AIzaSyBXg0NNnj9eZMfVwsBY0cKY4d42O485BtQ';
    const location = '26.851310,81.012420'; // Example: San Francisco coordinates
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=500&key=${apiKey}`;
    axios.get(apiUrl)
        .then(response => {
            res.json(response.data.results)
        })
        .catch(error => {
            console.error('Error fetching places:', error);
        });
})


app.listen(3000, () => {
    console.log('server listening');
})