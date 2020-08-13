//=======================================
//             Movie Schema
//=======================================

const types = `
  type Movie { 
    id: Int!
    name: String!
    rating: Int!
  }
`;

const queries = `
  movies: [Movie!]!  
  movie(id: Int!): Movie
`;

const mutations = `
  addMovie(name: String!, rating: Int!): Movie!
`;

module.exports = {
    types,
    queries,
    mutations
};