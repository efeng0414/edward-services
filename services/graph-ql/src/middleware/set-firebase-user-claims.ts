import { NextFunction, Request, Response } from "express";
import _get from "lodash.get";
import { Pool, PoolClient, QueryResult } from "pg";

const getUserRoleData = (databasePool: Pool, firebaseUserId: string) =>
  new Promise<Request["role"]>((resolve, reject) => {
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
          "SELECT user_role from marketplace.user_id_and_role(_firebase_uid => $1)",
          [firebaseUserId],
          (queryError: Error, result: QueryResult) => {
            client.release();

            if (queryError) {
              return reject(queryError);
            }

            const role = _get(result, "rows[0].user_role");

            if (!role) {
              return reject({ message: "User not found" });
            }

            return resolve(role);
          }
        );
      }
    );
  });

// @ts-ignore
const setFirebaseUserClaims = (auth, databasePool: Pool) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  const firebaseClaims = req.firebaseClaims || {};
  const firebaseUserId = req.firebaseUserId;
  let userType: string = null;

  // Check for existing claims
  if ((firebaseClaims && firebaseClaims.user_type) || !firebaseUserId) {
    console.log(`${firebaseUserId} Has claim ${firebaseClaims.user_type}`);
    return next();
  }

  // Check DB for user
  try {
    if (firebaseUserId) {
      // Go to database - when function available
      userType = await getUserRoleData(databasePool, firebaseUserId);
    }
  } catch (e) {
    console.error(e);
  }

  // Set userRoleData on firebase claims
  auth()
    .setCustomUserClaims(firebaseClaims.sub, {
      user_type: userType
    })
    .then(() => {
      console.log(`${firebaseUserId} set to ${userType}`);
      return next();
    })
    .catch(() => {
      console.log(`${firebaseUserId} ERROR SETTING ${userType}`);
      return next();
    });
};

export default setFirebaseUserClaims;
