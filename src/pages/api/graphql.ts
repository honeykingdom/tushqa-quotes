// https://github.com/aleccool213/next-js-typeorm-typegraphql-example/blob/master/pages/api/graphql.ts
import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import jwt from "next-auth/jwt";
import RatingResolver from "server/resolvers/rating";
import { getQuotes } from "server/utils/getQuotes";
import { Context, User } from "types";
import { createConnection } from "server/db";

// TODO: https://github.com/vercel/vercel/discussions/5846
require("ts-tiny-invariant");

const secret = process.env.SECRET!;

export const config = { api: { bodyParser: false } };

let apolloServerHandler: (req: any, res: any) => Promise<void>;

const makeGetUserId = (req: NextApiRequest) => async () => {
  const user = (await jwt.getToken({ req, secret })) as User | null;

  return user?.sub || null;
};

const getApolloServerHandler = async () => {
  if (apolloServerHandler) return apolloServerHandler;

  const [, schema] = await Promise.all([
    createConnection(),
    buildSchema({
      resolvers: [RatingResolver],
      validate: false,
      emitSchemaFile: process.env.NODE_ENV === "development",
    }),
  ]);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({
      req,
      res,
      getUserId: makeGetUserId(req),
      getQuotes,
    }),
  });

  await apolloServer.start();

  apolloServerHandler = apolloServer.createHandler({ path: "/api/graphql" });

  return apolloServerHandler;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloServerHandler = await getApolloServerHandler();

  return apolloServerHandler(req, res);
};
