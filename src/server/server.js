const express = require('express');
const request = require('request');

const app = express();

const baseUrl = 'https://api.flickr.com/services/rest/?';

//TODO: it's better to put this key to env file or read from database
const flikr_api_key = '476c4563d9ef372a95973d09720e166e';

app.use(express.static('dist'));
app.get('/flikr/fetchPhotos', (req, res) => {
    let perPage = req.query.per_page;
    let page = req.query.page;
    request(baseUrl + `api_key=${flikr_api_key}&method=flickr.photos.getRecent&format=json&nojsoncallback=1&per_page=${perPage}&page=${page}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});
app.get('/flikr/fetchSinglePhoto', (req, res) => {
    let photoId = req.query.photo_id;
    request(baseUrl + `api_key=${flikr_api_key}&method=flickr.photos.getSizes&format=json&&nojsoncallback=1&photo_id=${photoId}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body);
        }
    });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
