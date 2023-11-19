import { View, Text } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../hooks/auth";

const Home = () => {
  const authState = useContext(AuthContext);

  return (
    <View>
      <Text>
        Hello{" "}
        {authState.state === "initialized" && authState.user
          ? authState.user.email
          : "should not happen"}
      </Text>
    </View>
  );
};

export default Home;
