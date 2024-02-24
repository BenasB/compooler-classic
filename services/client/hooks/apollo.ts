import {
  ApolloClient,
  NormalizedCacheObject,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";
import Constants from "expo-constants";
import { useState } from "react";
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

const groupMakerEndpoint = createHttpLink({
  uri:
    process.env.EXPO_PUBLIC_GROUP_MAKER_API_URL ||
    `http://${localIp}:19001/graphql`,
});

const ridesEndpoint = createHttpLink({
  uri:
    process.env.EXPO_PUBLIC_RIDES_API_URL || `http://${localIp}:19002/graphql`,
});

export enum Clients {
  GroupMaker = "groupMaker",
  Rides = "rides",
}

export const useApolloRoot = () => {
  const [client, setClient] = useState<
    ApolloClient<NormalizedCacheObject> | undefined
  >(undefined); // Start off with undefined, soon to be initialized after auth initializes

  const setupClient = async (authState: AuthState) => {
    const createClient = async () => {
      let link: ApolloLink | undefined;
      if (authState.state === "loggedIn") {
        const token = await authState.user.getIdToken();
        link = createAuthLink(token).split(
          (op) => op.getContext().clientName === Clients.GroupMaker,
          groupMakerEndpoint,
          ridesEndpoint
        );
      } else if (authState.state === "loggedOut") {
        link = ApolloLink.split(
          (op) => op.getContext().clientName === Clients.GroupMaker,
          groupMakerEndpoint,
          ridesEndpoint
        );
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
        client.setLink(
          createAuthLink(token).split(
            (op) => op.getContext().clientName === Clients.GroupMaker,
            groupMakerEndpoint,
            ridesEndpoint
          )
        );
        await client.resetStore();
      } else if (authState.state === "loggedOut") {
        client.setLink(
          ApolloLink.split(
            (op) => op.getContext().clientName === Clients.GroupMaker,
            groupMakerEndpoint,
            ridesEndpoint
          )
        );
        await client.clearStore();
      }
    };

    if (client === undefined) {
      // On startup
      await createClient();
    } else {
      // If the auth state changes later on
      await updateClient(client);
    }
  };

  return { client, setupClient };
};
