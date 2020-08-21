"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = require('body-parser');
var _a = require('apollo-server-express'), graphqlExpress = _a.graphqlExpress, graphiqlExpress = _a.graphiqlExpress;
var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
var port = 4000;
// 환경 변수 
require('dotenv').config();
// DB Connection 과정 
var db = require('../models');
db.sequelize.sync();
// import GraphQL ingredients 
var typeDefs = require('../graphql/schemas').typeDefs;
var resolvers = require('../graphql/resolvers').resolvers;
// graphql-tool을 이용하여 apollo server에 필요한 요소 모듈화
var schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});
// Server 생성자 클래스
var Server = /** @class */ (function () {
    function Server() {
        this.application = express_1.default();
    }
    return Server;
}());
// Server 생성
var server = new Server().application;
// The GraphQL endpoint
server.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));
// GraphiQL, a visual editor for queries
server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
server.listen(port, function () {
    console.log('Go to http://localhost:4000/graphiql to run queries!');
});
//# sourceMappingURL=index.js.map