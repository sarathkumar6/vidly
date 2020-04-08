class Genres {
    constructor(genresCollection) {
        this.genresCollection = genresCollection;
    }
    
    getGenres = function getGenres() {
        return this.genresCollection
    }
    setGenres = function setGenres(genres) {
        this.genresCollection = genres;
    }
}

module.exports = Genres;