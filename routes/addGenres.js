const Joi = require('@hapi/joi');
const _ = require('lodash');
const addGenresSchema = Joi.object({
    genreType: Joi.string().min(3).required(),
    movies: Joi.array().min(2).required()
})
function hasTheGenre(genresCollection, genreType) {
    return _.findIndex(genresCollection, (genre) => {
        console.log(genreType);
        return _.isEqual(genre.genreId, _.capitalize(genreType.substr(0, 3)));
    })
}
const addGenres = function addGenres(request, response, genresCollection, updateCollection) {
    const addGenresValidation = addGenresSchema.validate(request.body);
    const genreType = request.body.genreType;
    const genreAlreadyExists = hasTheGenre(genresCollection, genreType);
    console.log('genreAlreadyExists: ', genreAlreadyExists);
    if (!addGenresValidation.error && genreAlreadyExists < 0) {
        const cloneGenresCollection = _.cloneDeep(genresCollection);
        const genre = request.body;
        genre.genreId = _.capitalize(genreType.substr(0, 3));
        cloneGenresCollection.push(genre);
        updateCollection(cloneGenresCollection);
        return response
            .send(cloneGenresCollection[cloneGenresCollection.length -1]);
    } else {
        return response
                .status(400)
                .send(genreAlreadyExists > 0 ? addGenresValidation.error : 'Genre Already Exists');
    }
}

module.exports = addGenres;