import {
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  InMemoryCache,
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
  const [client] = useState<ApolloClient<NormalizedCacheObject>>(
    new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    })
  );

  useEffect(() => {
    const updateClient = async () => {
      if (authState.state === "loggedIn") {
        const token = await authState.user.getIdToken();
        client.setLink(createAuthLink(token).concat(httpLink));
      } else {
        client.setLink(httpLink);
      }

      await client.clearStore();
    };

    updateClient();
  }, [authState.state]);

  return client;
};
