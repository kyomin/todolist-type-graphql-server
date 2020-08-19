/* import moduls */
const { ApolloServer } = require('apollo-server');
require('dotenv').config();

/* DB Connection 과정 */
const db = require('./models');
db.sequelize.sync();

/* import GraphQL ingredients */
const { typeDefs } = require('./graphql/schemas');
const { resolvers } = require('./graphql/resolvers');

// ApolloServer는 스키마와 리졸버가 반드시 필요함.
const server = new ApolloServer({
  typeDefs,
  resolvers
});


// listen 함수로 웹 서버 실행
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});