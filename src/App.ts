import * as express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import "reflect-metadata";
require('dotenv').config();

/* Import GraphQL Resolvers */
import { TodoResolver, UserResolver } from './resolvers';

class App {
  public app: express.Application;

  public static bootstrap (): App {
    return new App();
  }

  constructor () {
    this.app = express();

    this.app.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send("TypeScript & GraphQL & ApolloServer & Express 적용 연습");
    });
  }
}

const main = async () => {
  /* DB Connection 과정 */
  await createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      __dirname + "/entity/*.ts"
    ],
    synchronize: true
  })
  .then(() => {
    console.log('DB connection is successful with typeorm');
  })
  .catch((err) => {
    console.log(err)
  });

  const port: number = 4000;
  const app: express.Application = new App().app;
  const schema = await buildSchema({
    resolvers: [ TodoResolver, UserResolver ]
  });

  const server = new ApolloServer({
    schema,
    playground: true
  });

  // 미들웨어가 같은 경로에 마운트되도록 한다.
  server.applyMiddleware({ app, path: '/graphql' });

  await app.listen({ port: port }, () => {
    console.log(`Express & Apollo Server listening at ${port}`);
  });
}

main();