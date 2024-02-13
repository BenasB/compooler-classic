import {
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { setContext } from "@apollo/client/link/context";
import { AuthState } from "./auth";

const localIp = Platform.select<string>({
  default: Constants?.expoConfig?.hostUri?.split(`:`).shift() || "",
  web: "localhost",
});

const createAuthLink = (token: string) =>
  setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

const httpLink = createHttpLink({
  uri:
    process.env.EXPO_PUBLIC_GROUP_MAKER_API_URL ||
    `http://${localIp}:19001/graphql`,
});

export const useApolloRoot = (authState: AuthState) => {
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined); // Start off with undefined, soon to be initialized after auth initializes

  useEffect(() => {
    const createClient = async () => {
      let link: ApolloLink | undefined;
      if (authState.state === "loggedIn") {
        const token = await authState.user.getIdToken();
        link = createAuthLink(token).concat(httpLink);
      } else if (authState.state === "loggedOut") {
        link = httpLink;
      }

      setClient(
        new ApolloClient({
          link,
          cache: new InMemoryCache(),
        })
      );
    };

    const updateClient = async (
      client: ApolloClient<NormalizedCacheObject>
    ) => {
      if (authState.state === "loggedIn") {
        const token = await authState.user.getIdToken();
        client.setLink(createAuthLink(token).concat(httpLink));
        await client.resetStore();
      } else if (authState.state === "loggedOut") {
        client.setLink(httpLink);
        await client.clearStore();
      }
    };

    if (client === undefined) {
      // On startup
      createClient();
    } else {
      // If the auth state changes later on
      updateClient(client);
    }
  }, [authState.state]);

  return client;
};
