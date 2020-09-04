import * as express from "express";
import * as bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import "reflect-metadata";
import { logger } from "../../config/winston";
require("dotenv").config();

import { TodoResolver, UserResolver } from "./resolver";
import { context, authChecker } from "./context";
import { authMiddleware } from "./middleware";

class MainServer {
  public app: express.Application;

  public static bootstrap(): MainServer {
    return new MainServer();
  }

  constructor() {
    this.app = express();

    this.app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("This Is Main Resource Server !!");
    });
  }
}

const formatError = (err) => {
  console.error("\n\n");
  console.error("--- Main Server GraphQL Error ---");
  console.error("Path:", err.path);
  console.error("Message:", err.message);
  console.error("Code:", err.extensions.code);
  console.error("Original Error", err.originalError);
  return err;
};

const boostMainServer = async () => {
  /* DB Connection 과정 */
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.MAIN_SERVER_DB_NAME,
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });

    logger.info("Database for main server connection is successful with typeorm");
  } catch (err) {
    console.error("메인 서버 DB 에러 ! : ", err);
    logger.error(err);
  }

  const port: number = 4000;
  const path: string = "/graphql";
  const app: express.Application = new MainServer().app;

  /* 미들웨어 등록 */
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(authMiddleware);

  const schema = await buildSchema({
    resolvers: [TodoResolver, UserResolver],
    authChecker,
    authMode: "null",
  });

  const server = new ApolloServer({
    schema,
    context,
    playground: true,
    formatError,
    debug: false,
  });

  // 미들웨어가 같은 경로에 마운트되도록 한다.
  server.applyMiddleware({ app, path });

  await app.listen({ port: port }, () => {
    logger.info(`Express & Apollo Main Server listening at ${port}`);
  });
};

boostMainServer();
