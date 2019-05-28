import {
  NOTIFICATION_CHANNEL,
  EMAIL_ACTION,
  SENDER_INFORMATION
} from "./config/constants";
import { configure } from "./config";
configure();

import connect from "./database/client";

// DB connect
connect(
  console.log,
  [NOTIFICATION_CHANNEL]
);

// Imports
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { templates } from "./email";
import { generateActionLink } from "./email-actions";

const app = express();

// Middlewares
// *************************************
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Service
// *************************************
app.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { type, email, first_name } = req.body;

  const isEmailAction = Object.keys(EMAIL_ACTION).some(
    //@ts-ignore
    key => EMAIL_ACTION[key] === type
  );

  if (type) {
    if (isEmailAction) {
      try {
        const link = await generateActionLink({ type, email });

        await templates({
          type,
          payload: { ...SENDER_INFORMATION, user: { email, first_name }, link }
        });

        res.send({ success: true });
      } catch (err) {
        console.log("error sending email:", err);
        return res.send({ success: false });
      }
    } else {
      res.send({ success: false });
    }
  } else {
    res.send({ success: false });
  }
});

// Listen
// *************************************
const SERVER_PORT = process.env.SERVER_PORT || 4000;
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}...`);
});
