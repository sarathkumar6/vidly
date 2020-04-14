/* 
    1. Create a class that holds movie genres information
    2. Create a genreConstants to get default genre
    3. Create a route to get a genre through genreId
*/
const _ = require('lodash');
const express = require('express');
const vidlyApp = new express();
const genres = require('./routes/genresRoutes');

const mongoose = require('mongoose');
mongoose
    .connect("mongodb://localhost/vidly", { useFindAndModify: false })
    .then(() => console.log('Connection established with vidly'))
    .catch((error) => console.log('Connection to playgound failed', error));

// Adding a piece of middleware to request pip=eline to grab the request body
vidlyApp.use(express.json());

vidlyApp.use('/api/vidly/genres', genres);

vidlyApp.listen(6000, () => console.log('Listening to port 6000'));