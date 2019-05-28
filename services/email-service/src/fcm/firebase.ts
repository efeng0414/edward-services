import * as admin from "firebase-admin";
import fs from "fs";

const options = {
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  // @ts-ignore
  credential: admin.credential.cert(
    JSON.parse(fs.readFileSync(process.env.SERVICE_ACCOUNT_KEY).toString())
  )
};

if (!admin.apps.length) {
  admin.initializeApp(options);
}

export default admin;
