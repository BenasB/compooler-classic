import React from "react";
import { Slot } from "expo-router";
import { ActivityIndicator, useColorScheme } from "react-native";
import { AuthContextProvider, useAuthenticationRoot } from "../hooks/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Center, GluestackUIProvider, Spinner } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const AppLayout = () => {
  const colorScheme = useColorScheme();
  const { authState } = useAuthenticationRoot();

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
        {body}
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default AppLayout;
