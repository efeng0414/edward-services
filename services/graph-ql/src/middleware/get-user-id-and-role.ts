import { NextFunction, Request, Response } from "express";
import _get from "lodash.get";
import { Pool, PoolClient, QueryResult } from "pg";

// Local cache of userroles.
const userRoles: {
  [key: string]: {
    [key: string]: mixed;
  };
} = {};

const getSessionDetailsFromDatabase = (
  databasePool: Pool,
  firebaseUserId: string
) =>
  new Promise<Request["pgSettings"]>((resolve, reject) => {
    // Connect and query the database.
    databasePool.connect(
      (
        connectionError: Error,
        client: PoolClient,
        done: (release?: any) => void
      ) => {
        if (connectionError) {
          return reject(connectionError);
        }

        client.query(
          "SELECT * from marketplace.user_id_and_role(_firebase_uid => $1)", // TODO: const query
          [firebaseUserId],
          (queryError: Error, result: QueryResult) => {
            client.release();

            if (queryError) {
              return reject(queryError);
            }

            const role = _get(result, "rows[0].user_role");
            const uuid = _get(result, "rows[0].user_uuid");

            if (!role || !uuid) {
              return reject({ message: "User not found" });
            }

            const databaseSession = {
              "user.firebaseid": firebaseUserId,
              "user.uuid": uuid,
              role
            };

            // Set in cache
            userRoles[firebaseUserId] = databaseSession;

            return resolve(databaseSession);
          }
        );
      }
    );
  });

const getUserIdAndRole = (databasePool: Pool) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hrstart = process.hrtime();
  const firebaseUserId = req.firebaseUserId;
  let idAndRoleSesssionData = null;

  // Check for cached data
  if (firebaseUserId && userRoles[firebaseUserId]) {
    idAndRoleSesssionData = userRoles[firebaseUserId];
  }

  // Check DB for user
  try {
    if (firebaseUserId) {
      // Go to database - when function available
      idAndRoleSesssionData = await getSessionDetailsFromDatabase(
        databasePool,
        firebaseUserId
      );
    }
  } catch (e) {
    console.error(e);
  }

  // Set pgSettings for Postgres
  req.pgSettings = idAndRoleSesssionData;

  const hrend = process.hrtime(hrstart);
  console.info(
    "getUserIdAndRole success: Execution time (hr): %ds %dms",
    hrend[0],
    hrend[1] / 1000000
  );
  next();
};

export default getUserIdAndRole;
