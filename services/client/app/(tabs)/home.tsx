import { Text } from "@gluestack-ui/themed";
import React from "react";
import { usePrivateAuthContext } from "../../hooks/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const authState = usePrivateAuthContext();

  return (
    <SafeAreaView>
      <Text>Hello {authState.user.email}</Text>
    </SafeAreaView>
  );
};

export default Home;
