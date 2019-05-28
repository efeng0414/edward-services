import { configure } from "./config";
configure();

import Compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import firebase, { bucket as defaultBucket } from "./config/firebase";

import { isLocal } from "./config";
import { isExists } from "./utilities/urlExists";
import { AVATAR_BUCKET, READ, URL_EXPIRY } from "./config/constants";

const localEnv = isLocal();
const app = express();

console.log("Environment: " + process.env.NODE_ENV);
console.log("Is Local: " + localEnv);

const router = express.Router();
// Middlewares
// *************************************
app.use(cors()); // TODO: Proper cors
app.use(Compression());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);

// *************************************
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  if (localEnv) {
    res.send("image resolver service is running on local");
  }
});

router.post(
  "/resolveimage",
  async (req: Request, res: Response, next: NextFunction) => {
    // get the ids
    const ids = req.body.images;

    // check if query wants profile picture or license image
    const { type } = req.body;

    // init firebase bucket
    const bucket =
      type === AVATAR_BUCKET
        ? defaultBucket
        : firebase.storage().bucket(process.env.FIREBASE_LICENSE_BUCKET);

    let urls: Array<object> = [];

    // query bucket for the ids
    const getUrl = (id: string) =>
      bucket
        .file(`${id}/${type}`)
        .getSignedUrl({
          action: READ,
          expires: URL_EXPIRY
        })
        // bucket returns a url even if the image doesn't exist
        .then(async url => {
          // check for dead links
          const { href: urlFound } = await isExists(url[0]);

          // return null if url is not found
          urlFound ? null : (url[0] = null);

          // update arrary with the url(s)
          urls = [
            ...urls,
            {
              [id]: url[0]
            }
          ];

          // return the result
          if (urls.length === ids.length) {
            res.send(urls);
          }
        });

    // get urls for all available ids
    ids.map(getUrl);
  }
);

// Listen
// *************************************
const SERVER_PORT = process.env.SERVER_PORT || 5000;
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
