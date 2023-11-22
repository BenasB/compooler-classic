import { View, Text } from "react-native";
import React from "react";
import { usePrivateAuthContext } from "../../hooks/auth";

const Home = () => {
  const authState = usePrivateAuthContext();

  return (
    <View>
      <Text>Hello {authState.user.email}</Text>
    </View>
  );
};

export default Home;
