import React from "react";
import { Slot } from "expo-router";
import { useColorScheme } from "react-native";
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

const AppLayout = () => {
  const colorScheme = useColorScheme();
  const { authState } = useAuthenticationRoot();
  const apolloClient = useApolloRoot(authState);

  const body =
    authState.state === "uninitialized" ? (
      <Center h="$full">
        <Spinner size={"large"} />
      </Center>
    ) : (
      <AuthContextProvider value={authState}>
        <Slot />
      </AuthContextProvider>
    );

  return (
    <GluestackUIProvider config={config} colorMode={colorScheme || undefined}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ApolloProvider client={apolloClient}>{body}</ApolloProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default AppLayout;
