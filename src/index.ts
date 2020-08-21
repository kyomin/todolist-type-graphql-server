import express from 'express';
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const port: number = 4000;

// 환경 변수 
require('dotenv').config();

// DB Connection 과정 
const db = require('../models');
db.sequelize.sync();

// import GraphQL ingredients 
const { typeDefs } = require('../graphql/schemas');
const { resolvers } = require('../graphql/resolvers');

// graphql-tool을 이용하여 apollo server에 필요한 요소 모듈화
const schema = makeExecutableSchema({
  typeDefs:typeDefs,
  resolvers:resolvers,
});

// Server 생성자 클래스
class Server {
  public application: express.Application;

  constructor() {
    this.application = express();
  }
}

// Server 생성
const server = new Server().application;

// The GraphQL endpoint
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.listen(port, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});

