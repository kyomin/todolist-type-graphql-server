const todoResolver = require('./todo');

const resolvers = {
  Query: {
    ...todoResolver.queries
  },
  Mutation: {
    ...todoResolver.mutations
  }
};

module.exports = {
  resolvers
};

module.exports = {
  resolvers
};