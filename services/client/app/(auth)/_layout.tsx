import React from "react";
import { Redirect, Stack } from "expo-router";
import { usePublicAuthContext } from "../../hooks/auth";

const AuthLayout = () => {
  const authState = usePublicAuthContext();

  if (authState.state === "loggedIn") return <Redirect href="/home" />;

  return <Stack />;
};

export default AuthLayout;
