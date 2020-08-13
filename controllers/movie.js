const movieService = require('../services/movie');

//=======================================
//             Movie Controller
//=======================================

/* For Query Controll */
const getMovies = () => {
    return movieService.getMovies();
}

const getMovie = (parent, { id }) => {
    return movieService.getMovie(parent, { id });
}


/* For Mutation Controll */
const addMovie = (parent, { name, rating }) => {
    return movieService.addMovie(parent, { name, rating });
}

module.exports = {
    getMovies,
    getMovie,

    addMovie
};