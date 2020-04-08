const Joi = require('@hapi/joi');
const _ = require('lodash');
const updateSchema = Joi.object({
    genreType: Joi.string().min(3).required(),
    genreId: Joi.string().min(3).required(),
    movies: Joi.array().min(2).required()
});
function hasTheGenre(genresCollection, genreId) {
    return _.findIndex(genresCollection, (genre) => {
        console.log(genre);
        return _.isEqual(genre.genreId, genreId);
    })
}
const updateGenres = function addGenres(request, response, genresCollection, updateCollection) {
    const validateGenre = updateSchema.validate(request.body);
    const genreType = request.body.genreId;
    const genreExist = hasTheGenre(genresCollection, request.body.genreId);
    console.log('genreExist', genreExist);
    console.log('validationGenre.error', validateGenre.error);
    if (!validateGenre.error && _.gte(genreExist, 0)) {
        const cloneGenresCollection = _.cloneDeep(genresCollection);
        const genre = request.body;
        cloneGenresCollection[genreExist] = genre;
        updateCollection(cloneGenresCollection);
        return response
            .send(cloneGenresCollection[genreExist]);
    } else {
        return response
                .status(400)
                .send('Something fucked up');
    }
}

module.exports = updateGenres;
