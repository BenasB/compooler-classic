import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
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
connectAuthEmulator(firebaseAuth, `http://${localIp}:9099`, {
  disableWarnings: true,
}); // TODO: Don't always connect to emulator

export type AuthState =
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

const initialAuthState: AuthState = {
  state: "uninitialized",
  firebase: firebaseAuth,
};

const AuthContext = createContext<AuthState>(initialAuthState);

export const AuthContextProvider = AuthContext.Provider;

export const useAuthenticationRoot = (
  setupApolloClient: (authState: AuthState) => Promise<void>
) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authState.firebase, async (user) => {
      if (user) {
        console.log("Logged in", user);
        const newAuthState: AuthState = {
          ...authState,
          state: "loggedIn",
          user: user,
        };

        await setupApolloClient(newAuthState);
        setAuthState(newAuthState);
      } else {
        console.log("Logged out");
        const newAuthState: AuthState = {
          ...authState,
          state: "loggedOut",
        };

        await setupApolloClient(newAuthState);
        setAuthState(newAuthState);
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
