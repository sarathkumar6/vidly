const _ = require('lodash');

function findTheGenre(genresCollection, id) {
    return _.find(genresCollection, (genre)=> {
        return _.isEqual(genre.genreId, id);
    });
}

const getGenres = function getGenres(request, response, genresCollection) {
    const genreId = request.params.id;
    const genre = findTheGenre(genresCollection, genreId)
    return genre ? response.send(genre) : response.status(404).send('The genre id is not found');
};

module.exports = getGenres;