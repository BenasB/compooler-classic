import React from "react";
import { Slot } from "expo-router";
import { ActivityIndicator, useColorScheme } from "react-native";
import { AuthContextProvider, useAuthenticationRoot } from "../hooks/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const AppLayout = () => {
  const colorScheme = useColorScheme();
  const { authState } = useAuthenticationRoot();

  if (authState.state === "uninitialized") return <ActivityIndicator />;

  return (
    <GluestackUIProvider config={config} colorMode={colorScheme || undefined}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthContextProvider value={authState}>
          <Slot />
        </AuthContextProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
};

export default AppLayout;
