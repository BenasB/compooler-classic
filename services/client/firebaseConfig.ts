import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDjOK0yfaftNMPULD19_5O8ENIby3aj5d4",
  authDomain: "compooler.firebaseapp.com",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
connectAuthEmulator(FIREBASE_AUTH, "http://127.0.0.1:9099");
