import React from "react";
import { Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { AuthContextProvider, useAuthenticationRoot } from "../hooks/auth";

const AppLayout = () => {
  const { authState } = useAuthenticationRoot();

  if (authState.state === "uninitialized") return <ActivityIndicator />;

  return (
    <AuthContextProvider value={authState}>
      <Slot />
    </AuthContextProvider>
  );
};

export default AppLayout;
