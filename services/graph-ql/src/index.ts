import { configure } from "./config";
configure();

import Compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { auth } from "firebase-admin";
import { Pool } from "pg";
import { postgraphile } from "postgraphile";
import { isLocal } from "./config";
import admin_init from "./config/firebase";
import AuthenticateFirebaseToken from "./middleware/authenticate-firebase-user";
import DevelopmentFirebaseUserId from "./middleware/development-firebase-user";
import GetUserIdAndRole from "./middleware/get-user-id-and-role";
import SetFirebaseUserClaims from "./middleware/set-firebase-user-claims";
import EmailService from "./plugins/EmailService";
import CustomQueries from "./plugins/customQueries";
import { DatabaseConfigType, getDatabaseConfig } from "./utilities/database";
admin_init();

const DEFAULT_DB_RULE = "anonymous";
const localEnv = isLocal();
const app = express();
const databaseConfig: DatabaseConfigType = getDatabaseConfig();
const databasePool = new Pool({
  ...databaseConfig,
  max: 100
});

console.log("Environment: " + process.env.NODE_ENV);
console.log("Is Local: " + localEnv);

// Middlewares
// *************************************
app.use(cors()); // TODO: Proper cors
app.use(Compression());

if (process.env.NODE_ENV === "development") {
  app.use(DevelopmentFirebaseUserId); // Use supplied FirebaseUID if we're in development mode.
}

app.use(AuthenticateFirebaseToken(auth)); // Authenticate firebase token if one is supplied
app.use(SetFirebaseUserClaims(auth, databasePool)); // Authenticate firebase token if one is supplied
app.use(GetUserIdAndRole(databasePool)); // Set user UUID and role in req.pgSettings

// Postgraphile
// *************************************
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  if (localEnv) {
    console.log({
      Settings: req.pgSettings,
      pool: {
        total: databasePool.totalCount,
        inUse: databasePool.totalCount - databasePool.idleCount,
        idle: databasePool.idleCount,
        waiting: databasePool.waitingCount
      }
    });
  }

  const cacheOptions = localEnv
    ? {
        extendedErrors: ["hint", "detail", "errcode"],
        writeCache: process.env.SCHEMA_CACHE_FILE // Caches the schema. Run when schema changes
      }
    : { readCache: process.env.SCHEMA_CACHE_FILE }; // Uses the cached schema. Run in production

  const developerOptions =
    process.env.NODE_ENV === "development"
      ? {
          graphiql: true,
          graphiqlRoute: "/graphiql"
        }
      : {};

  return postgraphile(databasePool, "marketplace", {
    graphqlRoute: "/graphql",
    additionalGraphQLContextFromRequest: () =>
      new Promise((resolve, reject) =>
        resolve({
          firebaseUserId: req.firebaseUserId
        })
      ),
    pgSettings: req.pgSettings || { role: DEFAULT_DB_RULE },
    appendPlugins: [EmailService, CustomQueries],
    ...cacheOptions,
    ...developerOptions
  })(req, res, next);
});

// Listen
// *************************************
const SERVER_PORT = process.env.SERVER_PORT || 5000;
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
