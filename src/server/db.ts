// https://github.com/aleccool213/next-js-typeorm-typegraphql-example/blob/master/pages/api/lib/db/db.ts
import {
  createConnection as typeOrmCreateConnection,
  Connection,
} from "typeorm";
import Rating from "./entities/Rating";

let databaseConnection: Connection;

export const createConnection = async (): Promise<Connection> => {
  if (databaseConnection) {
    return databaseConnection;
  }

  try {
    databaseConnection = await typeOrmCreateConnection({
      type: "mongodb",
      url: process.env.DATABASE_URL,
      useNewUrlParser: true,
      w: "majority",
      ssl: true,
      authSource: "admin",
      entities: [Rating],
      logging: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.error(
      "Could not create a connection with the database, check settings!",
      e
    );
    throw e;
  }

  if (!databaseConnection) {
    throw new Error("database connection still does not exist!");
  }

  return databaseConnection;
};
