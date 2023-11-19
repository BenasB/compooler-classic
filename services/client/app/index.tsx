import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../hooks/auth";
import { ActivityIndicator } from "react-native";

const Index = () => {
  const authState = useContext(AuthContext);

  // TODO: handle when going straight to some path

  if (authState.state === "initialized") {
    if (authState.user) return <Redirect href={"/home"} />;
    else return <Redirect href={"/login"} />;
  } else {
    return <ActivityIndicator />;
  }
};

export default Index;
