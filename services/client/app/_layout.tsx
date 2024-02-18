import React from "react";
import { Slot } from "expo-router";
import { ColorSchemeName, Platform, useColorScheme } from "react-native";
import { AuthContextProvider, useAuthenticationRoot } from "../hooks/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Center, GluestackUIProvider, Spinner } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { ApolloProvider } from "@apollo/client";
import { useApolloRoot } from "../hooks/apollo";
import { APIProvider } from "@vis.gl/react-google-maps";

const AppLayout = () => {
  const colorScheme = useColorScheme();
  const { authState } = useAuthenticationRoot();
  const apolloClient = useApolloRoot(authState);

  const body =
    authState.state === "uninitialized" || apolloClient === undefined ? (
      <Center h="$full">
        <Spinner size={"large"} />
      </Center>
    ) : (
      <AuthContextProvider value={authState}>
        <ApolloProvider client={apolloClient}>
          <Slot />
        </ApolloProvider>
      </AuthContextProvider>
    );

  return (
    <GluestackUIProvider config={config} colorMode={colorScheme || undefined}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {platformProviders(body)}
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

const platformProviders = (body: JSX.Element) =>
  Platform.select({
    web: (
      <APIProvider
        apiKey={
          process.env.EXPO_PUBLIC_MAPS_API_KEY || "todo-handle-in-feat-21"
        }
      >
        {body}
      </APIProvider>
    ),
  }) || body;

export default AppLayout;
