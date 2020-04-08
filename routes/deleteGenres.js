const _ = require('lodash');
const Joi = require('@hapi/joi');

function findTheGenre(genresCollection, id) {
    return _.find(genresCollection, (genre)=> {
        return _.isEqual(genre.genreId, id);
    });
}
function removeTheGenre(genresCollection, id) {
    return _.remove(genresCollection, (genre) => {
        return !_.isEqual(genre.genreId, id);
    });
}

const deleteGenres = function getGenres(request, response, genresCollection, updateCollection) {
    const genreId = request.params.id;
    const genre = findTheGenre(genresCollection, genreId);
    if(genre) {
        const updatedGenresCollection = removeTheGenre(_.cloneDeep(genresCollection), genreId);
        updateCollection(updatedGenresCollection);
        response.send(genre);
    } else {
        response.status(404).send('The genre id is not found');
    };
};

module.exports = deleteGenres;