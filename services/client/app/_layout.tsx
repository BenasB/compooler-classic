import React from "react";
import { Stack } from "expo-router";
import { AuthContext, useAuthentication } from "../hooks/auth";

const RootLayout = () => {
  const { authState } = useAuthentication();

  return (
    <AuthContext.Provider value={authState}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext.Provider>
  );
};

export default RootLayout;
