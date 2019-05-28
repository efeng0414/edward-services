import { generatePayload } from "./config/utlities";
// Dotenv config
import { configure } from "./config";
configure();

import { GET_LISTINGS, GET_LISTING_IDS } from "./config/constants";

// Imports
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import query from "./database/query";

const app = express();

// Middlewares
// *************************************
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Filter Listings
// *************************************
app.get("/filter", function(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = generatePayload({ ...req.query, filter: true });

    //  TODO: propertyTypes are supposed to be string of numbers but hardcoding for now
    query(GET_LISTING_IDS, payload, function(result: Array<object>) {
      res.set("Content-Type", "application/json");
      res.status(200).send(result[0].getlistingsid);
      next();
    });
  } catch (err) {
    console.log("Error fetching listings: ", err);
    next();
  }
});

// Sort Listings
// *************************************
app.get("/sort", function(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = generatePayload(req.query);

    //  TODO: propertyTypes are supposed to be string of numbers but hardcoding for now
    query(GET_LISTINGS, payload, function(result: Array<object>) {
      res.set("Content-Type", "application/json");
      res.status(200).send(result.filter(Boolean));
    });
  } catch (err) {
    console.log("Error sorting listings: ", err);
  }
});

// Listen
// *************************************
const SERVER_PORT = process.env.SERVER_PORT || 5001;
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
