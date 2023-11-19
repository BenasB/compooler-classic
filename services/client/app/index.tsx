import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../hooks/auth";
import { ActivityIndicator } from "react-native";

const Index = () => {
  const authState = useContext(AuthContext);

  if (authState.state === "initialized" && authState.user) {
    return <Redirect href={"/home"} />;
  } else {
    return <ActivityIndicator />;
  }
};

export default Index;
