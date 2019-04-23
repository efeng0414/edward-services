// Dotenv config
import { configure } from "../config";
configure();

// Imports
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { sendReferralContract } from "./referral";

export default function() {
  const app = express();

  // Middlewares
  // *************************************
  app.use(cors());
  app.use(bodyParser());

  // Service
  // *************************************
  app.post("/", (req: Request, res: Response, next: NextFunction) => {
    sendReferralContract(req.body);

    res.send("Tried to send referral");
  });

  // Listen
  // *************************************
  const SERVER_PORT = process.env.SERVER_PORT || 4000;
  app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}...`);
  });
}
