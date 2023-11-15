import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import Constants from "expo-constants";

const firebaseConfig: FirebaseOptions = {
  apiKey: undefined || "demo-anything", // TODO: Take from env
  authDomain: "compooler.firebaseapp.com",
};

const localIp = Constants?.expoConfig?.hostUri?.split(`:`).shift();

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
connectAuthEmulator(FIREBASE_AUTH, `http://${localIp}:9099`);
