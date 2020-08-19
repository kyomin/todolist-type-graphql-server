
const { gql } = require('apollo-server');

const todoSchema = require('./todo');
const userSchema = require('./user')

const typeDefs = gql`
  ${todoSchema.types}
  ${userSchema.types}
  
  type Query {
    ${todoSchema.queries}
    ${userSchema.queries}
  }

  type Mutation {
    ${todoSchema.mutations}
    ${userSchema.mutations}
  }
`

module.exports = {
  typeDefs
};