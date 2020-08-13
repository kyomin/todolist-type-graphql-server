const { movies } = require('../database/movies');

//=======================================
//             Movie Service
//=======================================

/* For Query Service */
const getMovies = () => movies;

const getMovie = (parent, { id }) => {
    return movies.filter(movie => movie.id === id)[0];
}


/* For Mutation Service */
const addMovie = (parent, { name, rating }) => {
    // 영화 제목 중복 검사
    if (movies.find(movie => movie.name === name)) return null;
        
    // 데이터베이스에 추가
    const newMovie = {
      id: movies.length + 1,
      name,
      rating
    };
    movies.push(newMovie);
    return newMovie;
}

module.exports = {
    getMovies,
    getMovie,

    addMovie
};