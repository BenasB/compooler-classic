import React from "react";
import { Stack } from "expo-router";
import { AuthContextProvider, useAuthenticationRoot } from "../hooks/auth";
import { ActivityIndicator } from "react-native";

const RootLayout = () => {
  const { authState } = useAuthenticationRoot();

  // Placeholder until auth is initialized
  if (authState.state === "uninitialized") return <ActivityIndicator />;

  return (
    <AuthContextProvider value={authState}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContextProvider>
  );
};

export default RootLayout;
