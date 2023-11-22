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
import { createContext, useContext, useEffect, useState } from "react";
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
      state: "loggedIn";
      user: User;
      firebase: Auth;
    }
  | {
      state: "loggedOut";
      firebase: Auth;
    }
  | { state: "uninitialized"; firebase: Auth };

const initialAuthState: State = {
  state: "uninitialized",
  firebase: firebaseAuth,
};

const AuthContext = createContext<State>(initialAuthState);

export const AuthContextProvider = AuthContext.Provider;

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
          state: "loggedIn",
          user: user,
        }));
      } else {
        console.log("Logged out");
        setAuthState((prevState) => ({
          ...prevState,
          state: "loggedOut",
        }));
      }
    });

    return unsubscribe;
  }, []);

  return { authState };
};

/**
 * To be used with pages that expect an authenticated user
 */
export const usePrivateAuthContext = () => {
  const ctx = useContext(AuthContext);

  if (ctx.state !== "loggedIn")
    throw new Error(
      `Expected there to be a user in this context, but state was ${ctx.state}`
    );

  return ctx;
};

/**
 * To be used with pages that expect an unauthenticated (anonymous) user
 */
export const useAnonymousAuthContext = () => {
  const ctx = useContext(AuthContext);

  if (ctx.state !== "loggedOut")
    throw new Error(
      `Expected auth to be initialized and a logged out user, but state was ${ctx.state}`
    );

  return ctx;
};

/**
 * To be used with pages that expect either an authenticated or an unauthenticated (anonymous) user
 */
export const usePublicAuthContext = () => {
  const ctx = useContext(AuthContext);

  if (ctx.state === "uninitialized")
    throw new Error(
      `Expected auth to be initialized, but state was ${ctx.state}`
    );

  return ctx;
};
