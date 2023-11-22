import React from "react";
import { usePublicAuthContext } from "../hooks/auth";
import { Redirect } from "expo-router";

const Index = () => {
  const authState = usePublicAuthContext();

  if (authState.state === "loggedIn") {
    return <Redirect href={"/home"} />;
  } else if (authState.state === "loggedOut") {
    return <Redirect href={"/login"} />;
  }
};

export default Index;
