const movieController = require('../../controllers/movie');

//=======================================
//             Movie Resolver
//=======================================

const queries = {
    movies: movieController.getMovies,
    movie: movieController.getMovie
};

const mutations = {
    addMovie: movieController.addMovie
};

module.exports = {
    queries,
    mutations
};