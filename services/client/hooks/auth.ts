import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useSegments, useRouter } from "expo-router";
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  Auth,
  User,
  connectAuthEmulator,
  //@ts-ignore
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  browserLocalPersistence,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Platform } from "react-native";

const localIp = Platform.select<string>({
  default: Constants?.expoConfig?.hostUri?.split(`:`).shift() || "",
  web: "localhost",
});

const firebaseConfig: FirebaseOptions = {
  apiKey: undefined || "demo-anything", // TODO: Take from env
  authDomain: "compooler.firebaseapp.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = initializeAuth(firebaseApp, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});
connectAuthEmulator(firebaseAuth, `http://${localIp}:9099`); // TODO: Don't always connect to emulator

type State =
  | {
      state: "initialized";
      user: User | undefined;
      firebase: Auth;
    }
  | { state: "uninitialized"; firebase: Auth };

const initialAuthState: State = {
  state: "uninitialized",
  firebase: firebaseAuth,
};

export const AuthContext = createContext<State>(initialAuthState);

export const useAuthenticationRoot = () => {
  const [authState, setAuthState] = useState<State>(initialAuthState);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authState.firebase, (user) => {
      if (user) {
        console.log("Logged in", user);
        setAuthState((prevState) => ({
          ...prevState,
          state: "initialized",
          user: user,
        }));
      } else {
        console.log("Logged out");
        setAuthState((prevState) => ({
          ...prevState,
          state: "initialized",
          user: undefined,
        }));
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authState.state !== "initialized") {
      return;
    }

    const isInAuthRoute = segments[0] === "(auth)";
    const isLoggedIn = authState.user !== undefined;

    if (!isInAuthRoute && !isLoggedIn) router.replace("/login");
    else if (isInAuthRoute && isLoggedIn) router.replace("/home");
  }, [segments, authState.state]);

  return { authState };
};
