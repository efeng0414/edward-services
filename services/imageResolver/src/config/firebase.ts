import * as firebase from "firebase-admin";
import fs from "fs";

const initFirebaseApp = () =>
  firebase.initializeApp({
    credential: firebase.credential.cert(
      JSON.parse(fs.readFileSync(process.env.SERVICE_ACCOUNT_KEY).toString())
    ),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

initFirebaseApp();

export const bucket = firebase
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET);

export default firebase;
