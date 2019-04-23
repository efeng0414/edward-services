// Dotenv config
import { configure } from "./config";
configure();

// Imports
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import queryAutocomplete from "./database/queryAutocomplete";

const app = express();

// Middlewares
// *************************************
app.use(cors());
app.use(bodyParser());

// Service
// *************************************
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  const term = req.query.term;

  if (term) {
    queryAutocomplete(term)
      .then(result => res.send(result))
      .catch(result => res.send(result));
  } else {
    res.send({});
  }
});

// Listen
// *************************************
const SERVER_PORT = process.env.SERVER_PORT || 4000;
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
