import * as admin from "firebase-admin";
import fs from "fs";

const initialize = (customName?: string) => {
  admin.initializeApp(
    {
      credential: admin.credential.cert(
        JSON.parse(fs.readFileSync(process.env.SERVICE_ACCOUNT_KEY).toString())
      )
    },
    customName
  );
};

export default initialize;
