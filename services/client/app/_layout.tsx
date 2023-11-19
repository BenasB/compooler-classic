import React from "react";
import { Stack } from "expo-router";
import { AuthContext, useAuthenticationRoot } from "../hooks/auth";
import { ActivityIndicator } from "react-native";

const RootLayout = () => {
  const { authState } = useAuthenticationRoot();

  if (authState.state !== "initialized") return <ActivityIndicator />;

  return (
    <AuthContext.Provider value={authState}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext.Provider>
  );
};

export default RootLayout;
