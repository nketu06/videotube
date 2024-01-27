import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";


initializeApp();

const firestore=new Firestore();
const storage = new Storage();

const rawVideoBucketName="nketu-yt-raw-videos";

export const createUser=functions.auth.user().onCreate((user)=>{
  const userInfo={
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

export const generateUploadUrl= onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "This function must be called while authenticated."
    );
  }
  const auth= request.auth;
  const data = request.data;
  const bucket=storage.bucket(rawVideoBucketName);
  // generate unique filename
  const fileName=`${auth.uid}-${Date.now()}.${data.FileExtension}`;

  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now()+15*60*100,
  });
  return {url, fileName};
});
