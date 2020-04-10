const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const genresCollection = require('../genreConstants');
const defaultGenres = require('../genreConstants');
const Genre = require('../genres');
const vidly = new Genre(_.cloneDeep(defaultGenres));
const addGenresSchema = Joi.object({
    genreType: Joi.string().min(3).required(),
    movies: Joi.array().min(2).required()
});
const updateSchema = Joi.object({
    genreType: Joi.string().min(3).required(),
    genreId: Joi.string().min(3).required(),
    movies: Joi.array().min(2).required()
});

function updateCollection(genresCollection) {
    vidly.setGenres(genresCollection);
    console.log('Updated Collection: ', vidly.getGenres());
}

function findTheGenre(genresCollection, id) {
    return _.find(genresCollection, (genre)=> {
        return _.isEqual(genre.genreId, id);
    });
}

function hasTheGenrePost(genresCollection, genreType) {
    return _.findIndex(genresCollection, (genre) => {
        console.log(genreType);
        return _.isEqual(genre.genreId, _.capitalize(genreType.substr(0, 3)));
    })
}

function hasTheGenre(genresCollection, genreId) {
    return _.findIndex(genresCollection, (genre) => {
        console.log(genre);
        return _.isEqual(genre.genreId, genreId);
    })
}

function removeTheGenre(genresCollection, id) {
    return _.remove(genresCollection, (genre) => {
        return !_.isEqual(genre.genreId, id);
    });
}

router.get('/:id',(request, response) => {
    const genreId = request.params.id;
    const genre = findTheGenre(vidly.getGenres(), genreId)
    return genre ? response.send(genre) : response.status(404).send('The genre id is not found');
});


router.post('/',(request, response) => {
    const addGenresValidation = addGenresSchema.validate(request.body);
    const genreType = request.body.genreType;
    const genreAlreadyExists = hasTheGenrePost(genresCollection, genreType);
    if (!addGenresValidation.error && genreAlreadyExists < 0) {
        const cloneGenresCollection = _.cloneDeep(genresCollection);
        const genre = request.body;
        genre.genreId = _.capitalize(genreType.substr(0, 3));
        cloneGenresCollection.push(genre);
        updateCollection(cloneGenresCollection);
        return response.send(cloneGenresCollection[cloneGenresCollection.length -1]);
    } else {
        return response.status(400).send(genreAlreadyExists > 0 ? addGenresValidation.error : 'Genre Already Exists');
    }
});


router.put('/', (request, response) => {
    const validateGenre = updateSchema.validate(request.body);
    const genresCollection = vidly.getGenres();
    const genreExist = hasTheGenre(genresCollection, request.body.genreId);
    if (!validateGenre.error && _.gte(genreExist, 0)) {
        const cloneGenresCollection = _.cloneDeep(genresCollection);
        const genre = request.body;
        cloneGenresCollection[genreExist] = genre;
        updateCollection(cloneGenresCollection);
        return response.send(cloneGenresCollection[genreExist]);
    } else response.status(400).send('Something fucked up');
    
});

router.delete("/:id", (request, response) => {
  const genreId = request.params.id;
  const genresCollection = vidly.getGenres();
  const genre = findTheGenre(genresCollection, genreId);
  if (genre) {
    const updatedGenresCollection = removeTheGenre(
      _.cloneDeep(genresCollection),
      genreId
    );
    updateCollection(updatedGenresCollection);
    response.send(genre);
  } else {
    response.status(404).send("The genre id is not found");
  }
});

module.exports = router;