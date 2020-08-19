const todoResolver = require('./todo');
const userResolver = require('./user');

const resolvers = {
  Query: {
    ...todoResolver.queries,
    ...userResolver.queries
  },
  Mutation: {
    ...todoResolver.mutations,
    ...userResolver.mutations
  }
};

module.exports = {
  resolvers
};
