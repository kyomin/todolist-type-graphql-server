/* import moduls */
const { ApolloServer } = require('apollo-server');

/* import db config moduls */
const dbConfig = require('./config/database');
const db = require('./models');

/* DB Connection 과정 */
const connection = dbConfig.init();
dbConfig.connect(connection);
db.sequelize.sync();

/* import GraphQL ingredients */
const { typeDefs } = require('./graphql/schemas');
const { resolvers } = require('./graphql/resolvers');
const { context } = require('./graphql/context/context');

// ApolloServer는 스키마와 리졸버가 반드시 필요함.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
});


// listen 함수로 웹 서버 실행
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});