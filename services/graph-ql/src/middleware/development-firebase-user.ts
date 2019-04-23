import { NextFunction, Request, Response } from "express";

const developmentFirebaseUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof req.headers.firebaseuseridfordevelopmentonly === "string") {
    req.firebaseUserId = req.headers.firebaseuseridfordevelopmentonly;
  }

  next();
};

export default developmentFirebaseUserId;
