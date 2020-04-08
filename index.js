/* 
    1. Create a class that holds movie genres information
    2. Create a genreConstants to get default genre
    3. Create a route to get a genre through genreId
*/

const Genre = require('./genres');
const _ = require('lodash');
const defaultGenres = require('./genreConstants');
const express = require('express');
const getGenres = require('./routes/getGenres');
const addGenres = require('./routes/addGenres');
const deleteGenres = require('./routes/deleteGenres');
const updateGenres = require('./routes/updateGenres');
const vidlyApp = new express();
const vidly = new Genre(_.cloneDeep(defaultGenres));

function updateCollection(genresCollection) {
    vidly.setGenres(genresCollection);
}
// Adding a piece of middleware to request pip=eline to grab the request body
vidlyApp.use(express.json());

// Route to get a genre
vidlyApp.get('/api/vidly/genres/:id', (request, response) => getGenres(request, response, vidly.getGenres()));

// Route to add a genre
vidlyApp.post('/api/vidly/genres', (request, response) => addGenres(request, response, vidly.getGenres(), updateCollection));    

// Route to delete a genre
vidlyApp.delete('/api/vidly/genres/:id', (request, response) => deleteGenres(request, response, vidly.getGenres(), updateCollection));

// Route to update a genre
vidlyApp.put('/api/vidly/genres', (request, response) => updateGenres(request, response, vidly.getGenres(), updateCollection));


vidlyApp.listen(2000, () => console.log('Listening to port 2000'));

// 