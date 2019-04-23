import * as admin from "firebase-admin";

const serviceAccountKeyPath = `../../service-account-keys/${
  process.env.ACCOUNT_KEY_NAME
}`;

const options = {
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  // @ts-ignore
  credential: admin.credential.cert(require(serviceAccountKeyPath))
};

if (!admin.apps.length) admin.initializeApp(options);

export default admin;
