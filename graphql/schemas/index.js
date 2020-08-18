const { gql } = require('apollo-server');

const todoSchema = require('./todo');

const typeDefs = gql`
  ${todoSchema.types}

  type Query {
    ${todoSchema.queries}
  }

  type Mutation {
    ${todoSchema.mutations}
  }
`;

module.exports = {
  typeDefs
};