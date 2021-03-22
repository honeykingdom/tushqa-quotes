import "reflect-metadata";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { createConnection } from "./src/server/db";
import { getQuotes } from "./src/server/utils/getQuotes";
import RatingResolver from "./src/server/resolvers/rating";
import { Context } from "./src/types";

dotenv.config();

type DevServerContext = Omit<Context, "req" | "res"> & {
  req: Request;
  res: Response;
};

const main = async () => {
  await createConnection();

  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RatingResolver],
      validate: false,
      emitSchemaFile: true,
    }),
    context: ({ req, res }): DevServerContext => ({
      req,
      res,
      getUserId: async () => process.env.DEV_SERVER_USER_ID!,
      getQuotes,
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
