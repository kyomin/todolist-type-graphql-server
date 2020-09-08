import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import "reflect-metadata";
import { logger } from "../../config/winston";
require("dotenv").config();

/* Import GraphQL Resolvers */
import { AuthResolver } from "./resolver";

class AuthServer {
  public app: express.Application;

  public static bootstrap(): AuthServer {
    return new AuthServer();
  }

  constructor() {
    this.app = express();

    this.app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("This Is Auth Server !!");
    });
  }
}

const formatError = (err) => {
  console.error("\n\n");
  console.error("--- Auth Server GraphQL Error ---");
  console.error("Path:", err.path);
  console.error("Message:", err.message);
  console.error("Code:", err.extensions.code);
  console.error("Original Error", err.originalError);
  return err;
};

const boostAuthServer = async () => {
  /* DB Connection 과정 */
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.AUTH_SERVER_DB_NAME,
      entities: [__dirname + "/entity/*.ts"],
      synchronize: true,
    });

    logger.info("Database for auth server connection is successful with typeorm");
  } catch (err) {
    logger.error(err);
  }

  const port: number = 4001;
  const app: express.Application = new AuthServer().app;
  const schema = await buildSchema({
    resolvers: [AuthResolver],
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    formatError,
    debug: false,
  });

  // 미들웨어가 같은 경로에 마운트되도록 한다.
  server.applyMiddleware({ app, path: "/graphql" });

  await app.listen({ port: port }, () => {
    logger.info(`Express & Apollo Auth Server listening at ${port}`);
  });
};

boostAuthServer();
