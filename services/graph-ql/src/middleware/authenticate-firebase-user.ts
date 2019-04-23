import { NextFunction, Request, Response } from "express";

// @ts-ignore
const authenticateFirebaseToken = auth => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hrstart = process.hrtime();
  return typeof req.headers.firebasetoken === "string"
    ? auth()
        .verifyIdToken(req.headers.firebasetoken)
        // @ts-ignore
        .then(claims => {
          // @ts-ignore
          req.firebaseClaims = claims;
          req.firebaseUserId = claims.user_id;
          const hrend = process.hrtime(hrstart);
          console.info(
            "authenticateFirebaseToken success: Execution time (hr): %ds %dms",
            hrend[0],
            hrend[1] / 1000000
          );
          next();
        })
        .catch((error: Error) => {
          console.error({ error });
          const hrend = process.hrtime(hrstart);
          console.info(
            "authenticateFirebaseToken error: Execution time (hr): %ds %dms",
            hrend[0],
            hrend[1] / 1000000
          );
          next();
        })
    : next();
};

export default authenticateFirebaseToken;
